import rawData from "./raw_data.json";

const byTag = rawData.reduce((acc, item) => {
  acc[item.tag] = item;
  return acc;
}, {});

const responseFor = (tag) => byTag[tag]?.response?.[0] || "";
const questionsFor = (tag) => byTag[tag]?.questions || [];

export const PROGRAMS = [
  {
    slug: "computer-engineering",
    title: "Computer Engineering",
    shortTitle: "Computer",
    level: "UG",
    tags: {
      overview: "computer_engineering",
      intakeFE: "computer_first",
      intakeDSY: "computer_dsy",
      feeOpen: "open_fee",
      feeObc: "obc_fee",
      feeScst: "scst_fee",
      eligibility: "computer_criteria",
      duration: "computer_duration",
    },
  },
  {
    slug: "it-engineering",
    title: "IT Engineering",
    shortTitle: "IT",
    level: "UG",
    tags: {
      overview: "it_engineering",
      intakeFE: "it_first",
      intakeDSY: "it_dsy",
      feeOpen: "open_fee",
      feeObc: "obc_fee",
      feeScst: "scst_fee",
      eligibility: "it_criteria",
      duration: "it_duration",
    },
  },
  {
    slug: "mechanical-engineering",
    title: "Mechanical Engineering",
    shortTitle: "Mechanical",
    level: "UG",
    tags: {
      overview: "mechanical_engineering",
      intakeFE: "mechanical_first",
      intakeDSY: "mechanical_dsy",
      feeOpen: "open_fee",
      feeObc: "obc_fee",
      feeScst: "scst_fee",
      eligibility: "mechanical_criteria",
      duration: "mechanical_duration",
    },
  },
  {
    slug: "entc-engineering",
    title: "E&TC Engineering",
    shortTitle: "E&TC",
    level: "UG",
    tags: {
      overview: "entc_engineering",
      intakeFE: "entc_first",
      intakeDSY: "entc_dsy",
      feeOpen: "open_fee",
      feeObc: "obc_fee",
      feeScst: "scst_fee",
      eligibility: "entc_criteria",
      duration: "entc_duration",
    },
  },
  {
    slug: "ai-ds-engineering",
    title: "AI & Data Science",
    shortTitle: "AI&DS",
    level: "UG",
    tags: {
      overview: "ai&ds_engineering",
      intakeFE: "ai&ds_first",
      intakeDSY: "ai&ds_dsy",
      feeOpen: "open_fee",
      feeObc: "obc_fee",
      feeScst: "scst_fee",
      eligibility: "ai&ds_criteria",
      duration: "ai&ds_duration",
    },
  },
  {
    slug: "mba",
    title: "MBA Programs",
    shortTitle: "MBA",
    level: "PG",
    tags: {
      overview: "mba_course",
      intakeFE: "mba_intake",
      intakeDSY: "",
      feeOpen: "mba_open_fee",
      feeObc: "mba_obc_fee",
      feeScst: "mba_scst_fee",
      eligibility: "mba_criteria",
      duration: "mba_duration",
    },
  },
];

export const PROGRAM_LINKS = PROGRAMS.map((program) => ({
  slug: program.slug,
  title: program.title,
}));

export const getProgramBySlug = (slug) => {
  const base = PROGRAMS.find((program) => program.slug === slug);
  if (!base) return null;

  const details = {
    ...base,
    overview: responseFor(base.tags.overview),
    intakeFE: responseFor(base.tags.intakeFE),
    intakeDSY: base.tags.intakeDSY ? responseFor(base.tags.intakeDSY) : "",
    feeOpen: responseFor(base.tags.feeOpen),
    feeObc: responseFor(base.tags.feeObc),
    feeScst: responseFor(base.tags.feeScst),
    eligibility: responseFor(base.tags.eligibility),
    duration: responseFor(base.tags.duration),
    commonQueries: questionsFor(base.tags.overview),
  };

  return details;
};

