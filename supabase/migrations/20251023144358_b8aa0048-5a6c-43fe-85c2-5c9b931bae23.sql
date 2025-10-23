-- Add missing sections for UAE using data from countries table
DO $$
DECLARE
  uae_country_id uuid;
  uae_data record;
BEGIN
  -- Get UAE country data
  SELECT * INTO uae_data FROM countries WHERE slug = 'united-arab-emirates';
  uae_country_id := uae_data.id;

  -- Add 'about' section using about_content
  INSERT INTO country_sections (country_id, section_name, title, content, order_index, is_enabled)
  VALUES (
    uae_country_id,
    'about',
    'About United Arab Emirates',
    jsonb_build_object('description', uae_data.about_content),
    4,
    true
  );

  -- Add 'fun_facts' section
  INSERT INTO country_sections (country_id, section_name, title, content, order_index, is_enabled)
  VALUES (
    uae_country_id,
    'fun_facts',
    'Fun Facts About UAE',
    jsonb_build_object('facts', (
      SELECT jsonb_agg(fact->>'text')
      FROM jsonb_array_elements(uae_data.fun_facts) AS fact
    )),
    5,
    true
  );

  -- Add 'before_you_go' section
  INSERT INTO country_sections (country_id, section_name, title, content, order_index, is_enabled)
  VALUES (
    uae_country_id,
    'before_you_go',
    'Before You Go',
    jsonb_build_object('tips', (
      SELECT jsonb_agg(tip->>'text')
      FROM jsonb_array_elements(uae_data.before_you_go_tips) AS tip
    )),
    6,
    true
  );

  -- Add 'best_time' section
  INSERT INTO country_sections (country_id, section_name, title, content, order_index, is_enabled)
  VALUES (
    uae_country_id,
    'best_time',
    'Best Time to Visit',
    jsonb_build_object('content', uae_data.best_time_content),
    7,
    true
  );

  -- Add 'reasons_to_visit' section
  INSERT INTO country_sections (country_id, section_name, title, content, order_index, is_enabled)
  VALUES (
    uae_country_id,
    'reasons_to_visit',
    'Why Visit UAE',
    jsonb_build_object('reasons', (
      SELECT jsonb_agg(reason->>'text')
      FROM jsonb_array_elements(uae_data.reasons_to_visit) AS reason
    )),
    8,
    true
  );

  -- Add 'food_shopping' section (split the combined content)
  INSERT INTO country_sections (country_id, section_name, title, content, order_index, is_enabled)
  VALUES (
    uae_country_id,
    'food_shopping',
    'Food & Shopping',
    jsonb_build_object(
      'food', split_part(uae_data.food_shopping_content, 'The Dubai Mall', 1),
      'shopping', 'The Dubai Mall' || split_part(uae_data.food_shopping_content, 'The Dubai Mall', 2)
    ),
    9,
    true
  );

  -- Add 'dos_donts' section
  INSERT INTO country_sections (country_id, section_name, title, content, order_index, is_enabled)
  VALUES (
    uae_country_id,
    'dos_donts',
    'Do''s and Don''ts',
    jsonb_build_object(
      'dos', uae_data.dos_donts->'dos',
      'donts', uae_data.dos_donts->'donts'
    ),
    10,
    true
  );

  -- Add 'art_culture' section
  INSERT INTO country_sections (country_id, section_name, title, content, order_index, is_enabled)
  VALUES (
    uae_country_id,
    'art_culture',
    'Art & Culture',
    jsonb_build_object('content', uae_data.art_culture_content),
    11,
    true
  );

END $$;