CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

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

CREATE TABLE IF NOT EXISTS public.saved_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    resource_id TEXT NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, resource_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_resources_user ON public.saved_resources(user_id);

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

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile or admins view all" ON public.profiles;
CREATE POLICY "Users can view own profile or admins view all"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own display_name and metadata but not role" ON public.profiles;
CREATE POLICY "Users can update own display_name and metadata but not role"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id AND role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid()));

DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile"
    ON public.profiles FOR UPDATE
    USING (public.is_admin());

DROP POLICY IF EXISTS "Public can view verified and re-verification resources" ON public.resources;
CREATE POLICY "Public can view verified and re-verification resources"
    ON public.resources FOR SELECT
    USING (verification_status IN ('Verified', 'Needs Re-verification'));

DROP POLICY IF EXISTS "Admins have full access to resources" ON public.resources;
CREATE POLICY "Admins have full access to resources"
    ON public.resources FOR ALL
    USING (public.is_admin());

DROP POLICY IF EXISTS "Users manage their own saved resources" ON public.saved_resources;
CREATE POLICY "Users manage their own saved resources"
    ON public.saved_resources FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users manage their own action plans" ON public.action_plans;
CREATE POLICY "Users manage their own action plans"
    ON public.action_plans FOR ALL
    USING (auth.uid() = user_id OR user_id IS NULL)
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users manage steps for their plans" ON public.plan_steps;
CREATE POLICY "Users manage steps for their plans"
    ON public.plan_steps FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.action_plans
            WHERE action_plans.id = plan_steps.plan_id
            AND (action_plans.user_id = auth.uid() OR action_plans.user_id IS NULL)
        )
    );

DROP POLICY IF EXISTS "Partners view their own submissions" ON public.partner_submissions;
CREATE POLICY "Partners view their own submissions"
    ON public.partner_submissions FOR SELECT
    USING (auth.uid() = submitted_by OR public.is_admin());

DROP POLICY IF EXISTS "Partners insert their own submissions" ON public.partner_submissions;
CREATE POLICY "Partners insert their own submissions"
    ON public.partner_submissions FOR INSERT
    WITH CHECK (auth.uid() = submitted_by);

DROP POLICY IF EXISTS "Only admins moderate partner submissions" ON public.partner_submissions;
CREATE POLICY "Only admins moderate partner submissions"
    ON public.partner_submissions FOR UPDATE
    USING (public.is_admin());

DROP POLICY IF EXISTS "Anyone authenticated or anonymous can submit reports" ON public.resource_reports;
CREATE POLICY "Anyone authenticated or anonymous can submit reports"
    ON public.resource_reports FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins review and triage resource reports" ON public.resource_reports;
CREATE POLICY "Admins review and triage resource reports"
    ON public.resource_reports FOR ALL
    USING (public.is_admin());

DROP POLICY IF EXISTS "Admins view audit logs" ON public.audit_logs;
CREATE POLICY "Admins view audit logs"
    ON public.audit_logs FOR SELECT
    USING (public.is_admin());

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, display_name, role)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
        CASE 
            WHEN new.raw_user_meta_data->>'role' IN ('small_business', 'partner') THEN new.raw_user_meta_data->>'role'
            ELSE 'resident'
        END
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        updated_at = timezone('utc'::text, now());
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

INSERT INTO public.resources (
    id, name, provider_name, summary, description, category, tags, audience,
    coverage_type, city, region, postal_codes, official_url, application_url,
    contact_details, eligibility_criteria, required_documents, application_method,
    deadline, cost_details, language_accessibility, verification_status,
    source_checked_at, source_notes, provenance_type
) VALUES 
(
    'res-001', 'Russell Innovation Center for Entrepreneurs (RICE) Business Growth Academy', 'Russell Innovation Center for Entrepreneurs', 'Dedicated incubator, accelerator, and educational center supporting Black entrepreneurs and small businesses with mentorship, capacity building, and capital readiness.', 'RICE operates as a dedicated hub for Black entrepreneurs offering co-working space, curriculum-based business development (BIG IDEA program), one-on-one coaching, financial modeling assistance, and direct investor connections.', 'Small Business Support', ARRAY['entrepreneurship', 'mentorship', 'capital-readiness', 'accelerator', 'black-owned-business'], 'Small business owners, startups, and founders',
    'Regional', 'Atlanta', 'GA', ARRAY['30314', '30310', '30318', '30303', '30312'], '''https''://russellcenter.org', '''https''://russellcenter.org/apply',
    'info@russellcenter.org | (404) 793-2742', '{"business_stage": ["Early Stage", "Growth Stage", "Established"], "ownership": "Designed for Black founders and under-resourced entrepreneurs", "revenue_requirement": "Varies by cohort level (Idea stage to $250k+ revenue tracks)", "notes": "Must have an active or forming business entity registered in Georgia."}'::jsonb, ARRAY['Government-issued photo ID', 'Georgia business registration or formation documentation (if formed)', 'Executive summary or brief business description', 'Most recent financial statements or tax return (for growth cohorts)'], 'Online Application through RICE portal followed by an intake orientation.',
    'Rolling cohort admissions (Quarterly reviews)', 'Subsidized membership and tiered equity-free participation fees.', 'English, assistive technology-compatible digital portal.', 'Verified',
    '2026-09-15'::timestamptz, 'Information confirmed directly against Russell Center official program overview and public admission requirements.', 'Official Nonprofit Organization Website'
),
(
    'res-002', 'Invest Atlanta Small Business Opportunity Fund', 'Invest Atlanta (City of Atlanta Economic Development Authority)', 'Flexible low-cost commercial financing, micro-grants, and technical assistance for local businesses in designated Atlanta commercial corridors.', 'Invest Atlanta provides structured gap financing, low-interest microloans ($5,000 to $100,000), and technical consulting for small businesses located within City of Atlanta limits, focusing on historically disinvested corridors.', 'Small Business Support', ARRAY['grants', 'low-interest-loans', 'commercial-corridor', 'city-funding', 'microloan'], 'Brick-and-mortar storefronts and commercial small businesses',
    'City', 'Atlanta', 'GA', ARRAY['30303', '30310', '30314', '30315', '30318'], '''https''://www.investatlanta.com', '''https''://www.investatlanta.com/businesses/small-businesses',
    'businessloans@investatlanta.com | (404) 880-4100', '{"location": "Must have physical commercial location inside City of Atlanta boundaries", "business_age": "Minimum 1 year in operation (or approved startup with business plan)", "tax_compliance": "Must be current on City of Atlanta municipal business license and taxes", "notes": "Prioritizes businesses located within Atlanta Federal Opportunity Zones and Tax Allocation Districts."}'::jsonb, ARRAY['City of Atlanta Business License (valid and active)', 'Past 2 years business tax returns and profit & loss statements', 'Past 3 months business bank statements', 'Owner personal financial statement (SBA Form 413 equivalent)'], 'Invest Atlanta online portal with intake appointment from loan officer.',
    'Rolling while annual municipal funding allocations remain available.', 'No application fee; loans carry fixed below-market interest (approx. 3-6%).', 'English, Spanish translation available upon request.', 'Verified',
    '2026-09-20'::timestamptz, 'Verified against Invest Atlanta Small Business Loan Programs criteria and guidelines page.', 'Official Municipal Authority Portal'
),
(
    'res-003', 'Access to Capital for Entrepreneurs (ACE) Small Business Loans & Advisory', 'ACE (Access to Capital for Entrepreneurs CDFI)', 'Community Development Financial Institution (CDFI) providing affordable loans, financial coaching, and women/minority business advisory services.', 'ACE is a certified CDFI that helps business owners who might not qualify for conventional bank financing. Offers loans from $15,000 to $1,000,000 paired with tailored technical assistance, accounting coaching, and commercial planning.', 'Small Business Support', ARRAY['cdfi', 'small-business-loans', 'financial-coaching', 'women-owned', 'minority-owned'], 'Entrepreneurs, underserved business owners, small commercial operators',
    'Statewide', 'Atlanta', 'GA', ARRAY['All Georgia'], '''https''://aceloans.org', '''https''://aceloans.org/borrow/apply/',
    'borrow@aceloans.org | (678) 335-5600', '{"geographic_scope": "Operating in Georgia", "credit_flexibility": "Considers alternative credit histories and character-based evaluation", "purpose": "Working capital, inventory, equipment purchase, or commercial lease improvements"}'::jsonb, ARRAY['Business and personal bank statements (past 3 months)', 'Business tax returns (past 2 years)', 'Business plan or description of loan use', 'Identification and proof of business registration'], 'Online pre-application followed by meeting with an ACE Loan Officer.',
    'Open year-round', 'Varies by loan type; fixed community lending rates, no predatory clauses.', 'English and Spanish speaking advisors available.', 'Verified',
    '2026-09-18'::timestamptz, 'Confirmed on ACE CDFI public website loan guidelines.', 'Certified CDFI Official Website'
),
(
    'res-004', 'Low-Income Home Energy Assistance Program (LIHEAP) Energy Assistance', 'Georgia Department of Human Services / Division of Family & Children Services', 'Federally funded direct financial relief to help eligible low-income households pay winter heating and summer cooling utility bills.', 'LIHEAP provides one-time direct utility bill assistance (ranging from $350 to $650+) credited directly to an electric or natural gas provider for eligible households at or below 60% of the state median income.', 'Utilities & Household Bills', ARRAY['utilities', 'energy-assistance', 'electric-bill', 'gas-bill', 'emergency-relief'], 'Low-income households, seniors, individuals with disabilities, families with children',
    'Statewide', 'Atlanta', 'GA', ARRAY['All Georgia / Fulton County / DeKalb County'], '''https''://www.acf.hhs.gov/ocs/programs/liheap', '''https''://gateway.ga.gov',
    'Community Action Agency ''locator'': 1-877-423-4746', '{"income_limit": "Household gross income at or below 60% Georgia Median Income", "residency": "Georgia resident and U.S. citizen or legal permanent resident", "responsibility": "Household must be responsible for home heating/cooling costs"}'::jsonb, ARRAY['Current heating and electric bill copies (showing account numbers)', 'Proof of household gross income for past 30 days (pay stubs, SSA award letters, etc.)', 'Social Security cards or official documentation for all household members', 'Valid state-issued photo ID of applicant'], 'Apply via local Community Action Agency or online via GA Gateway.',
    'Senior/homebound priority opens November 1; general public opens December 1 until funds depleted.', '100% Free public benefit; grant is paid directly to utility company.', 'Multi-language telephone support through 1-877-423-4746.', 'Verified',
    '2026-09-10'::timestamptz, 'Verified against HHS OCS LIHEAP guidelines and GA DHS energy assistance announcement.', 'Official Government Agency (HHS & GA DHS)'
),
(
    'res-005', 'Atlanta Community Food Bank & Partner Food Pantry Network', 'Atlanta Community Food Bank (ACFB)', 'Accessible community food distributions, emergency grocery boxes, and ongoing family food assistance across greater Atlanta.', 'ACFB partners with over 700 local community food pantries, churches, and neighborhood distribution sites across 29 Georgia counties. Provides fresh produce, shelf-stable groceries, and emergency food supplies with minimal intake barriers.', 'Food & Essential Needs', ARRAY['food-pantry', 'groceries', 'fresh-produce', 'emergency-food', 'nutrition'], 'Any resident or family facing food insecurity or emergency grocery needs',
    'Regional', 'Atlanta', 'GA', ARRAY['All Metro Atlanta ZIP codes'], '''https''://www.acfb.org', '''https''://www.acfb.org/find-food/',
    'Text ''FINDFOOD'' (or ''COMIDA'') to 888-976-2232 | (404) 892-9822', '{"requirements": "Open to all households in need within the service area; no strict income documentation needed at most emergency pantries", "frequency": "Typically available once every 1 to 2 weeks per household depending on local distribution partner"}'::jsonb, ARRAY['Photo ID or proof of residence (utility bill or envelope with address) is recommended but rarely turned away for emergency visits'], 'Find nearest pantry via zip code search tool or text hotline; walk-in or drive-thru during pantry hours.',
    'Ongoing weekly and monthly distribution dates', '100% Free', 'English and Spanish text service available (FINDFOOD / COMIDA).', 'Verified',
    '2026-09-22'::timestamptz, 'Verified against official ACFB Food Finder guidelines and hotline details.', 'Regional Food Bank Official Source'
),
(
    'res-006', 'Urban League of Greater Atlanta Career & Financial Empowerment Center', 'Urban League of Greater Atlanta (ULGA)', 'Workforce certification training, job placement support, financial literacy counseling, and small business coaching.', 'ULGA empowers African Americans and underserved communities through free job training in high-demand industries (technology, logistics, healthcare, green jobs), resume workshops, one-on-one career coaching, and financial coaching.', 'Employment & Workforce Training', ARRAY['job-training', 'career-counseling', 'certifications', 'workforce', 'financial-literacy'], 'Job seekers, career changers, young adults, and unemployed/underemployed residents',
    'Regional', 'Atlanta', 'GA', ARRAY['30303', '30310', '30311', '30314', '30318', '30344'], '''https''://ulgatl.org', '''https''://ulgatl.org/programs-and-services/workforce-development/',
    'info@ulgatl.org | (404) 659-1150', '{"age": "18 years of age or older", "residency": "Resident of Greater Atlanta metro area", "commitment": "Willingness to attend scheduled cohort classes and coaching sessions"}'::jsonb, ARRAY['Valid government ID', 'High school diploma or GED equivalent (for certain certification cohorts)', 'Resume or prior work history summary (if available)'], 'Submit online intake form on ULGA website; attend a virtual or in-person orientation session.',
    'Cohorts begin monthly and quarterly depending on industry track.', 'Free for accepted participants through grant subsidies.', 'English instruction, accessible physical center.', 'Verified',
    '2026-09-12'::timestamptz, 'Confirmed on ULGA official programs and workforce portal.', 'Civil Rights & Civic Organization Official Portal'
),
(
    'res-007', 'Georgia Department of Community Affairs Housing Voucher & Rental Directory', 'Georgia Department of Community Affairs (DCA)', 'State housing authority managing Housing Choice Vouchers (Section 8), rental assistance programs, and affordable housing registries.', 'Georgia DCA administers rental assistance and provides verified access to income-based housing directories, tenant rights education, and homelessness prevention vouchers across non-metropolitan and partner counties.', 'Housing & Rental Support', ARRAY['section-8', 'housing-vouchers', 'affordable-housing', 'rental-assistance', 'tenant-rights'], 'Low-income families, elderly individuals, and persons with disabilities',
    'Statewide', 'Atlanta', 'GA', ARRAY['All Georgia'], '''https''://www.dca.ga.gov', '''https''://www.dca.ga.gov/safe-affordable-housing/rental-housing-assistance',
    'housingassistance@dca.ga.gov | (404) 679-4940', '{"income_limit": "Very low-income households (below 50% Area Median Income)", "citizenship": "U.S. citizens and specified categories of non-citizens with eligible immigration status", "background_check": "Standard criminal background check applicable under HUD federal regulations"}'::jsonb, ARRAY['Birth certificates and Social Security cards for all household members', 'Proof of all household income (paystubs, child support, benefit statements)', 'Current landlord reference or housing history'], 'Waiting list application via DCA online applicant portal when open.',
    'Waiting lists open periodically; check public notices on DCA website.', 'Free to apply; rent contribution capped at 30-40% of adjusted monthly household income.', 'HUD translated notices in Spanish, Vietnamese, Korean.', 'Verified',
    '2026-09-08'::timestamptz, 'Verified against Georgia DCA rental assistance guidelines and HUD rules.', 'Official State Government Agency Portal'
),
(
    'res-008', 'SCORE Atlanta Free Small Business Mentoring & Workshops', 'SCORE (Resource Partner of the U.S. Small Business Administration)', 'Confidential, one-on-one business advice and practical workshops led by experienced volunteer executives and entrepreneurs.', 'SCORE is a national nonprofit network and SBA resource partner providing free, confidential mentoring to anyone looking to start, run, or grow a business. Mentors assist with business plans, cash flow budgeting, marketing strategies, and loan pitch prep.', 'Small Business Support', ARRAY['business-mentoring', 'free-workshops', 'business-plan', 'sba-partner', 'advisory'], 'Aspiring entrepreneurs, existing small business owners, microenterprises',
    'Regional', 'Atlanta', 'GA', ARRAY['Metro Atlanta'], '''https''://www.score.org/atlanta', '''https''://www.score.org/find-mentor',
    'atlanta@scorevolunteer.org | (404) 331-0121', '{"open_access": "Completely free and open to any current or prospective entrepreneur in the United States", "no_revenue_requirements": "No revenue, credit score, or size restrictions"}'::jsonb, ARRAY['None required to request a mentor; draft business plan or notes helpful'], 'Submit simple online request specifying industry and business questions.',
    'Year-round availability', '100% Free funded in part through a Cooperative Agreement with the SBA.', 'Online virtual sessions, English and Spanish mentors available.', 'Verified',
    '2026-09-14'::timestamptz, 'Confirmed on official SCORE Atlanta SBA resource partner portal.', 'Official SBA Resource Partner'
),
(
    'res-009', 'United Way 2-1-1 Greater Atlanta Community Resource Connection', 'United Way of Greater Atlanta', 'Comprehensive 24/7 civic referral and navigation service connecting community members to local food, housing, utility, and health resources.', 'United Way 2-1-1 serves as the central clearinghouse for human services across 13 greater Atlanta counties. Trained community resource specialists assess needs and provide direct, verified referrals to local charities and emergency programs.', 'Community & Civic Services', ARRAY['referrals', 'emergency-assistance', 'social-services', '211', 'helpline'], 'Any resident seeking local human services and emergency guidance',
    'Regional', 'Atlanta', 'GA', ARRAY['All 13 Greater Atlanta Counties'], '''https''://www.211online.unitedwayatlanta.org', '''https''://www.211online.unitedwayatlanta.org',
    'Dial 2-1-1 or text your ZIP code and need to 898-211', '{"open_access": "Free and confidential service available to anyone in the service area", "referral_nature": "Specialists match caller to specific charity programs whose individual criteria apply"}'::jsonb, ARRAY['Depends on specific referral provider matched'], 'Call 2-1-1, text 898-211, or use the searchable web directory.',
    '24/7/365 Service', '100% Free', 'Interpretation available in 140+ languages via telephone translation line.', 'Verified',
    '2026-09-25'::timestamptz, 'Verified against United Way of Greater Atlanta 2-1-1 official portal.', 'United Way 2-1-1 Official Portal'
),
(
    'res-010', 'Morehouse Innovation & Entrepreneurship Center (MIEC) Capacity Builders', 'Morehouse College Innovation & Entrepreneurship Center', 'Academic and corporate-backed technical development program helping minority-owned enterprises scale through contracting and growth capital.', 'MIEC delivers tailored executive leadership education, corporate supplier diversity matchmaking, student-consulting support teams, and digital transformation workshops for Black and minority business owners across the Southeast.', 'Small Business Support', ARRAY['hbcu-initiative', 'supplier-diversity', 'executive-education', 'minority-business', 'scaling'], 'Growth-stage minority business enterprises (MBEs) seeking corporate contracts',
    'Regional', 'Atlanta', 'GA', ARRAY['30314', 'Metro Atlanta'], '''https''://www.morehouse.edu/academics/centers-and-institutes/innovation-and-entrepreneurship-center/', '''https''://www.morehouse.edu/academics/centers-and-institutes/innovation-and-entrepreneurship-center/',
    'miec@morehouse.edu | (470) 639-0562', '{"ownership": "51%+ minority-owned or diverse-certified business enterprise", "track_record": "Minimum 2 years operational history and documented revenue", "sector": "B2B products, professional services, construction, technology, logistics"}'::jsonb, ARRAY['Proof of business registration and ownership structure', 'Past 2 years financial statements or corporate tax filings', 'Capability statement or summary of products/services'], 'Direct submission to specific cohort announcements through Morehouse MIEC web page.',
    'Cohort-based; semi-annual intake', 'Corporate and philanthropic grant subsidized; free or low-cost for accepted fellows.', 'English, ADA accessible campus facilities and virtual webinars.', 'Verified',
    '2026-09-17'::timestamptz, 'Verified against Morehouse College official academic center publication.', 'HBCU Institution Official Website'
),
(
    'res-011', 'Goodwill of North Georgia Career Training Center', 'Goodwill of North Georgia', 'Tuition-free industry certification training programs in logistics, IT, welding, hospitality, and healthcare with direct employer placement.', 'Operates comprehensive career centers offering free vocational training, nationally recognized credential certifications, computer lab access, interview apparel, and guaranteed employer interviews for North Georgia residents seeking sustainable wages.', 'Employment & Workforce Training', ARRAY['vocational-training', 'certifications', 'free-classes', 'job-placement', 'skills-training'], 'Underemployed adults, career changers, formerly incarcerated individuals, veterans',
    'Regional', 'Atlanta', 'GA', ARRAY['30310', '30315', '30318', 'North Georgia'], '''https''://goodwillng.org', '''https''://goodwillng.org/career-services/',
    'careerservices@ging.org | (844) 344-4884', '{"age": "18 years of age or older", "right_to_work": "Authorized to work in the United States", "drug_screening": "May require drug screening for heavy machinery or healthcare tracks"}'::jsonb, ARRAY['Government-issued photo identification', 'Proof of Georgia address (utility bill or state ID)', 'Social Security card or employment authorization document'], 'Attend in-person or virtual orientation at nearest Goodwill Career Center.',
    'New cohorts start every 3 to 6 weeks depending on course discipline.', '100% Free through store sales reinvestment and workforce grant funding.', 'English, select Spanish bilingual training coordinators.', 'Verified',
    '2026-09-19'::timestamptz, 'Confirmed on Goodwill of North Georgia official career services directory.', 'Nonprofit Career Center Official Portal'
),
(
    'res-012', 'Atlanta Housing Choice Voucher Homeownership Program', 'Atlanta Housing (AH)', 'Assists qualified Section 8 voucher participants to transition voucher rental subsidies toward home mortgage payments.', 'Atlanta Housing''s Homeownership Voucher Program permits eligible first-time homebuyers with an active voucher to use their monthly housing subsidy toward a mortgage rather than rent, paired with mandatory HUD-approved homebuyer education.', 'Housing & Rental Support', ARRAY['homeownership', 'housing-subsidy', 'mortgage-assistance', 'wealth-building', 'atlanta-housing'], 'Current Atlanta Housing voucher holders and eligible public housing residents',
    'City', 'Atlanta', 'GA', ARRAY['City of Atlanta limits'], '''https''://www.atlantahousing.org', '''https''://www.atlantahousing.org/housing-programs/homeownership/',
    'homeownership@atlantahousing.org | (404) 892-4700', '{"voucher_status": "Must currently hold an active Housing Choice Voucher in good standing for at least one year", "homebuyer_status": "First-time homebuyer (no homeownership in past 3 years)", "employment_income": "Minimum earned annual income requirement ($24,000+ for non-elderly/disabled participants)", "education": "Must complete HUD-certified homebuyer education course"}'::jsonb, ARRAY['Active Housing Choice Voucher verification letter', 'HUD Homebuyer Education Certificate of Completion', 'Credit report and lender pre-qualification letter', 'Tax returns and W-2s for previous 2 years'], 'Submit internal transfer packet to Atlanta Housing Housing Choice Voucher specialist.',
    'Continuous open enrollment for active voucher participants.', 'Program participation is free; buyers contribute down payment (typically minimum 1-3%).', 'English, Spanish, and telecommunication relay services (TRS).', 'Needs Re-verification',
    '2026-05-10'::timestamptz, 'Annual fiscal review pending for current income thresholds; verify exact lender list with AH housing specialist.', 'Municipal Housing Authority Official Portal'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    provider_name = EXCLUDED.provider_name,
    summary = EXCLUDED.summary,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    official_url = EXCLUDED.official_url,
    updated_at = timezone('utc'::text, now());
