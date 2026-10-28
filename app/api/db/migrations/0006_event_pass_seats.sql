-- The Annual Dinner passes and their seats, as in DEFAULT_ANNUAL_DINNER_PASSES
-- (app/api/(features)/(pview)/event-pass/repository/eventPassRepository.ts). A pass that is already
-- there (seeded by the API, or changed in the admin panel) is left as it is.
INSERT INTO "event_passes" (
	"event_name", "pass_id", "tier_group", "tier_title", "title", "label", "description", "batch_eligibility",
	"price", "currency", "total_quantity", "available_quantity", "includes_spouse", "allows_children",
	"allows_teacher_sponsorship", "status", "status_note", "display_order", "metadata"
) VALUES
	('annual-dinner', 'yb-single', 'younger', 'Younger Batches', 'Single', 'Younger Batches · Single',
		'Single pass for alumni from batch 2015 to 2025', 'Batch 2015–25 only',
		2500, 'INR', 100, 100, false, false, true, 'active', '100 left', 1,
		'{"teacherSponsorPrice": 5000}'),
	('annual-dinner', 'yb-spouse', 'younger', 'Younger Batches', 'With spouse', 'Younger Batches · With spouse',
		'Couple pass for alumni from batch 2015 to 2025 and spouse', 'Batch 2015–25 only',
		4000, 'INR', 50, 50, true, false, true, 'active', '50 left', 2,
		'{"teacherSponsorPrice": 5000}'),
	('annual-dinner', 'eb-single', 'early', 'Early Bird', 'Single', 'Early Bird · Single',
		'Discounted early bird ticket for all alumni batches', 'All batches',
		3500, 'INR', 100, 100, false, false, true, 'active', '100 left', 3,
		'{"teacherSponsorPrice": 5000}'),
	('annual-dinner', 'eb-spouse', 'early', 'Early Bird', 'With spouse', 'Early Bird · With spouse',
		'Discounted early bird ticket for alumni and spouse, all batches', 'All batches',
		5000, 'INR', 50, 50, true, false, true, 'active', '50 left', 4,
		'{"teacherSponsorPrice": 5000}'),
	('annual-dinner', 'regular', 'regular', 'Regular', 'Regular', 'Regular',
		'Regular passes open once every Early Bird pass has been taken. Pricing is shown when they open.', 'All batches · opens after Early Bird',
		0, 'INR', 150, 150, false, false, true, 'locked', 'Opens after Early Bird', 5,
		'{"note": "Regular passes open once every Early Bird pass has been taken. Pricing is shown when they open.", "teacherSponsorPrice": 5000}'),
	('annual-dinner', 'golden', 'golden', 'Golden Pass', 'With spouse', 'Golden Pass · With spouse',
		'Golden pass with spouse and privileges to bring children under/above 12', 'All batches · with spouse',
		15000, 'INR', 30, 30, true, true, true, 'active', 'With spouse', 6,
		'{"perks": ["Add children, under or above 12"], "childUnder12Price": 2500, "childAbove12Price": 3000, "teacherSponsorPrice": 5000}')
ON CONFLICT ("event_name", "pass_id") DO NOTHING;
