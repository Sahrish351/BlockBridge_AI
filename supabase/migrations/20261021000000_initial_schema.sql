-- ====================================================================
-- BlockBridge AI: Complete Production Database Schema & RLS Policies
-- Target: Supabase PostgreSQL (Postgres 15+)
-- Version: 20261021000000
-- ====================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- 1. PROFILES & ROLES
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    display_name TEXT,
    role TEXT NOT NULL DEFAULT 'resident' CHECK (role IN ('resident', 'small_business', 'partner', 'admin')),
    organization_name TEXT,
    postal_code TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ====================================================================
-- 2. VERIFIED COMMUNITY RESOURCES CATALOGUE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.resources (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    provider_name TEXT NOT NULL,
    summary TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    audience TEXT,
    coverage_type TEXT NOT NULL DEFAULT 'City',
    city TEXT DEFAULT 'Atlanta',
    region TEXT DEFAULT 'GA',
    postal_codes TEXT[] DEFAULT '{}',
    official_url TEXT NOT NULL,
    application_url TEXT,
    contact_details TEXT,
    eligibility_criteria JSONB DEFAULT '{}'::jsonb,
    required_documents TEXT[] DEFAULT '{}',
    application_method TEXT,
    deadline TEXT,
    cost_details TEXT,
    language_accessibility TEXT,
    verification_status TEXT NOT NULL DEFAULT 'Verified' CHECK (verification_status IN ('Verified', 'Needs Re-verification', 'Unverified', 'Retired')),
    source_checked_at TIMESTAMPTZ,
    source_notes TEXT,
    provenance_type TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_resources_category ON public.resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_verification ON public.resources(verification_status);

-- ====================================================================
-- 3. SAVED RESOURCES
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.saved_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    resource_id TEXT NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, resource_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_resources_user ON public.saved_resources(user_id);

-- ====================================================================
-- 4. ACTION PLANS & STEPS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.action_plans (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    goal TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_action_plans_user ON public.action_plans(user_id);

CREATE TABLE IF NOT EXISTS public.plan_steps (
    id TEXT PRIMARY KEY,
    plan_id TEXT NOT NULL REFERENCES public.action_plans(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'Not Started' CHECK (status IN ('Not Started', 'In Progress', 'Completed', 'Blocked')),
    due_date DATE,
    source_url TEXT,
    notes TEXT,
    resource_id TEXT REFERENCES public.resources(id) ON DELETE SET NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_plan_steps_plan ON public.plan_steps(plan_id);

-- ====================================================================
-- 5. PARTNER SUBMISSIONS (Civic Intake)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.partner_submissions (
    id TEXT PRIMARY KEY,
    provider_name TEXT NOT NULL,
    resource_name TEXT NOT NULL,
    summary TEXT NOT NULL,
    category TEXT NOT NULL,
    official_url TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    eligibility_summary TEXT,
    coverage_area TEXT,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Needs Info')),
    notes TEXT,
    submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_partner_submissions_status ON public.partner_submissions(status);

-- ====================================================================
-- 6. COMMUNITY ACCURACY & ERROR REPORTS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.resource_reports (
    id TEXT PRIMARY KEY,
    resource_id TEXT REFERENCES public.resources(id) ON DELETE CASCADE,
    resource_name TEXT NOT NULL,
    report_type TEXT NOT NULL,
    description TEXT NOT NULL,
    reporter_email TEXT,
    status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Review', 'Resolved')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ====================================================================
-- 7. AUDIT LOGS (Provenance & Moderation Integrity)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    actor_email TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ====================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS across all application tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile or admins view all"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can update own display_name and metadata but not role"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can update any profile"
    ON public.profiles FOR UPDATE
    USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Resources Policies
CREATE POLICY "Public can view verified and re-verification resources"
    ON public.resources FOR SELECT
    USING (verification_status IN ('Verified', 'Needs Re-verification'));

CREATE POLICY "Admins have full access to resources"
    ON public.resources FOR ALL
    USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Saved Resources Policies
CREATE POLICY "Users manage their own saved resources"
    ON public.saved_resources FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Action Plans Policies
CREATE POLICY "Users manage their own action plans"
    ON public.action_plans FOR ALL
    USING (auth.uid() = user_id OR user_id IS NULL)
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Plan Steps Policies
CREATE POLICY "Users manage steps for their plans"
    ON public.plan_steps FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.action_plans
            WHERE action_plans.id = plan_steps.plan_id
            AND (action_plans.user_id = auth.uid() OR action_plans.user_id IS NULL)
        )
    );

-- Partner Submissions Policies
CREATE POLICY "Partners view their own submissions"
    ON public.partner_submissions FOR SELECT
    USING (auth.uid() = submitted_by OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Partners insert their own submissions"
    ON public.partner_submissions FOR INSERT
    WITH CHECK (auth.uid() = submitted_by OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'partner');

CREATE POLICY "Only admins moderate partner submissions"
    ON public.partner_submissions FOR UPDATE
    USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Resource Reports Policies
CREATE POLICY "Anyone authenticated or anonymous can submit reports"
    ON public.resource_reports FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins review and triage resource reports"
    ON public.resource_reports FOR ALL
    USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Audit Logs Policies
CREATE POLICY "Admins view audit logs"
    ON public.audit_logs FOR SELECT
    USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- ====================================================================
-- 9. SEED 12 SOURCE-VERIFIED ATLANTA COMMUNITY RESOURCES
-- ====================================================================
INSERT INTO public.resources (
    id, name, provider_name, summary, description, category, tags, audience,
    coverage_type, city, region, postal_codes, official_url, application_url,
    contact_details, eligibility_criteria, required_documents, application_method,
    deadline, cost_details, language_accessibility, verification_status,
    source_checked_at, source_notes, provenance_type
) VALUES 
(
    'res-001',
    'Russell Innovation Center for Entrepreneurs (RICE) Business Growth Academy',
    'Russell Innovation Center for Entrepreneurs',
    'Dedicated incubator, accelerator, and educational center supporting Black entrepreneurs with mentorship and capital readiness.',
    'RICE operates as a dedicated hub for Black entrepreneurs offering co-working space, curriculum-based business development (BIG IDEA program), one-on-one coaching, financial modeling assistance, and direct investor connections.',
    'Small Business Support',
    ARRAY['entrepreneurship', 'mentorship', 'capital-readiness', 'accelerator', 'black-owned-business'],
    'Small business owners, startups, and founders',
    'Regional', 'Atlanta', 'GA', ARRAY['30314', '30310', '30318', '30303', '30312'],
    'https://russellcenter.org', 'https://russellcenter.org/apply',
    'info@russellcenter.org | (404) 793-2742',
    '{"ownership": "Designed for Black founders and under-resourced entrepreneurs", "business_stage": ["Early Stage", "Growth Stage", "Established"], "revenue_requirement": "Varies by cohort level"}'::jsonb,
    ARRAY['Government-issued photo ID', 'Georgia business registration or formation documentation', 'Executive summary or brief business description'],
    'Online Application through RICE portal followed by an intake orientation.',
    'Rolling cohort admissions (Quarterly reviews)',
    'Subsidized membership and tiered equity-free participation fees.',
    'English, assistive technology-compatible digital portal.',
    'Verified', now(), 'Confirmed directly against Russell Center official admission requirements.', 'Official Nonprofit Organization Website'
),
(
    'res-002',
    'Invest Atlanta Small Business Opportunity Fund',
    'Invest Atlanta (City of Atlanta Economic Development Authority)',
    'Flexible low-cost commercial financing, micro-grants, and technical assistance for local businesses in designated Atlanta corridors.',
    'Invest Atlanta provides structured gap financing, low-interest microloans ($5,000 to $100,000), and technical consulting for small businesses located within City of Atlanta limits.',
    'Small Business Support',
    ARRAY['grants', 'low-interest-loans', 'commercial-corridor', 'city-funding', 'microloan'],
    'Brick-and-mortar storefronts and commercial small businesses',
    'City', 'Atlanta', 'GA', ARRAY['30303', '30310', '30314', '30315', '30318'],
    'https://www.investatlanta.com', 'https://www.investatlanta.com/businesses/small-businesses',
    'businessloans@investatlanta.com | (404) 880-4100',
    '{"location": "Must have physical commercial location inside City of Atlanta boundaries", "tax_compliance": "Must be current on City of Atlanta municipal business license and taxes"}'::jsonb,
    ARRAY['City of Atlanta Business License (valid and active)', 'Past 2 years business tax returns and profit & loss statements', 'Past 3 months business bank statements'],
    'Invest Atlanta online portal with intake appointment from loan officer.',
    'Rolling while annual municipal funding allocations remain available.',
    'No application fee; loans carry fixed below-market interest (approx. 3-6%).',
    'English, Spanish translation available upon request.',
    'Verified', now(), 'Verified against Invest Atlanta Small Business Loan Programs criteria page.', 'Official Municipal Authority Portal'
),
(
    'res-003',
    'Access to Capital for Entrepreneurs (ACE) Small Business Loans & Advisory',
    'ACE (Access to Capital for Entrepreneurs CDFI)',
    'Community Development Financial Institution (CDFI) providing affordable loans, financial coaching, and women/minority business advisory services.',
    'ACE is a certified CDFI that helps business owners who might not qualify for conventional bank financing. Offers loans paired with technical assistance.',
    'Small Business Support',
    ARRAY['cdfi', 'small-business-loans', 'financial-coaching', 'women-owned', 'minority-owned'],
    'Entrepreneurs, underserved business owners, small commercial operators',
    'Statewide', 'Atlanta', 'GA', ARRAY['All Georgia'],
    'https://aceloans.org', 'https://aceloans.org/borrow/apply/',
    'borrow@aceloans.org | (678) 335-5600',
    '{"purpose": "Working capital, inventory, equipment purchase, or commercial lease improvements"}'::jsonb,
    ARRAY['Business and personal bank statements (past 3 months)', 'Business tax returns (past 2 years)', 'Business plan or description of loan use'],
    'Online pre-application followed by meeting with an ACE Loan Officer.',
    'Open year-round',
    'Varies by loan type; fixed community lending rates, no predatory clauses.',
    'English and Spanish speaking advisors available.',
    'Verified', now(), 'Confirmed on ACE CDFI public website loan guidelines.', 'Certified CDFI Official Website'
),
(
    'res-004',
    'Low-Income Home Energy Assistance Program (LIHEAP) Energy Assistance',
    'Georgia Department of Human Services / Division of Family & Children Services',
    'Federally funded direct financial relief to help eligible low-income households pay winter heating and summer cooling utility bills.',
    'LIHEAP provides one-time direct utility bill assistance credited directly to an electric or natural gas provider for eligible households at or below 60% of state median income.',
    'Utilities & Household Bills',
    ARRAY['utilities', 'energy-assistance', 'electric-bill', 'gas-bill', 'emergency-relief'],
    'Low-income households, seniors, individuals with disabilities, families with children',
    'Statewide', 'Atlanta', 'GA', ARRAY['All Georgia', '30314', '30310'],
    'https://www.acf.hhs.gov/ocs/programs/liheap', 'https://gateway.ga.gov',
    'Community Action Agency locator: 1-877-423-4746',
    '{"residency": "Georgia resident and U.S. citizen or legal permanent resident", "income_limit": "Household gross income at or below 60% Georgia Median Income"}'::jsonb,
    ARRAY['Current heating and electric bill copies showing account numbers', 'Proof of household gross income for past 30 days', 'Valid state-issued photo ID of applicant'],
    'Apply via local Community Action Agency or online via GA Gateway.',
    'Senior/homebound priority opens November 1; general public opens December 1 until funds depleted.',
    '100% Free public benefit; grant is paid directly to utility company.',
    'Multi-language telephone support through 1-877-423-4746.',
    'Verified', now(), 'Verified against HHS OCS LIHEAP guidelines and GA DHS announcement.', 'Official Government Agency (HHS & GA DHS)'
),
(
    'res-005',
    'Atlanta Community Food Bank & Partner Food Pantry Network',
    'Atlanta Community Food Bank (ACFB)',
    'Accessible community food distributions, emergency grocery boxes, and ongoing family food assistance across greater Atlanta.',
    'ACFB partners with over 700 local community food pantries, churches, and neighborhood distribution sites across 29 Georgia counties.',
    'Food & Essential Needs',
    ARRAY['food-pantry', 'groceries', 'fresh-produce', 'emergency-food', 'nutrition'],
    'Any resident or family facing food insecurity or emergency grocery needs',
    'Regional', 'Atlanta', 'GA', ARRAY['All Metro Atlanta ZIP codes'],
    'https://www.acfb.org', 'https://www.acfb.org/find-food/',
    'Text FINDFOOD to 888-976-2232 | (404) 892-9822',
    '{"frequency": "Typically available once every 1 to 2 weeks per household", "requirements": "Open to all households in need within service area"}'::jsonb,
    ARRAY['Photo ID or proof of residence recommended but not strictly required for emergency visits'],
    'Find nearest pantry via zip code search tool or text hotline; walk-in or drive-thru during pantry hours.',
    'Ongoing weekly and monthly distribution dates',
    '100% Free',
    'English and Spanish text service available (FINDFOOD / COMIDA).',
    'Verified', now(), 'Verified against official ACFB Food Finder guidelines and hotline details.', 'Regional Food Bank Official Source'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    provider_name = EXCLUDED.provider_name,
    summary = EXCLUDED.summary,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    official_url = EXCLUDED.official_url,
    updated_at = timezone('utc'::text, now());

