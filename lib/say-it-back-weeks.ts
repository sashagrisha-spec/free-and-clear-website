// Say It Back: the 19 weeks, in the same order and with the same names as the
// Drive folder. Files live in the media store under these uniform names:
//   week-NN-section-N.m4a  and  week-NN-words.pdf
// `sections` holds each section length in seconds, shown next to it.

export type SibWeek = { n: number; title: string; sections: number[] }

export const SIB_WEEKS: SibWeek[] = [
  { n: 1, title: "TH sound + really and very", sections: [212, 187, 185] },
  { n: 2, title: "Past endings (ED sounds)", sections: [204, 198, 213] },
  { n: 3, title: "Natural stress + flow", sections: [253, 257, 135] },
  { n: 4, title: "EE vs i + Work Communication", sections: [284, 290] },
  { n: 5, title: "Past Simple - Mixed Life Contexts", sections: [277, 294, 135] },
  { n: 6, title: "The æ sound as in CAT", sections: [163, 281, 231] },
  { n: 7, title: "Present Perfect: I’ve / You’ve / We’ve / They’ve", sections: [260, 321, 150] },
  { n: 8, title: "Hard words in real sentences", sections: [267, 188, 245] },
  { n: 9, title: "Wanna / gonna / hafta / kinda / shoulda", sections: [164, 205, 216] },
  { n: 10, title: "Past simple in many forms", sections: [275, 212, 221] },
  { n: 11, title: "Present perfect", sections: [298, 244, 253] },
  { n: 12, title: "Kinda / Sorta / Outta / Lotta / Gonna", sections: [185, 238, 244] },
  { n: 13, title: "Prepositions", sections: [205, 223, 257] },
  { n: 14, title: "Comparing Things & Giving Opinions", sections: [247, 225, 254] },
  { n: 15, title: "Agreeing & disagreeing", sections: [164, 196, 232] },
  { n: 16, title: "Making suggestions & recommendations", sections: [211, 212, 257] },
  { n: 17, title: "Sound Collaborative, Not Confrontational", sections: [213, 195, 263] },
  { n: 18, title: "Keep the Conversation Going", sections: [190, 179, 247] },
  { n: 19, title: "Starting & Keeping a Conversation", sections: [240, 231, 325] },
]

export const sectionFile = (week: number, section: number) =>
  `week-${String(week).padStart(2, '0')}-section-${section}.m4a`
export const wordsFile = (week: number) => `week-${String(week).padStart(2, '0')}-words.pdf`
