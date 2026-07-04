/**
 * Academic structure & class hierarchy (SRS §4).
 *  - Ordinary Level (O/L):  Grades 6–11, parallel classes A / B / C
 *  - Advanced Level (A/L):  Grades 12–13, streams Commerce / Arts
 */

export const INSTITUTION_NAME = "Hunuwala Dharmaraja Vidyalaya";

export const OL_GRADES = ["6", "7", "8", "9", "10", "11"] as const;
export const AL_GRADES = ["12", "13"] as const;
export const GRADES = [...OL_GRADES, ...AL_GRADES] as const;

export const OL_CLASSES = ["A", "B", "C"] as const;
export const AL_STREAMS = ["Commerce", "Arts"] as const;

export type Grade = (typeof GRADES)[number];
export type OLClass = (typeof OL_CLASSES)[number];
export type ALStream = (typeof AL_STREAMS)[number];
export type SubDivision = OLClass | ALStream;

export function isALGrade(grade: string): boolean {
  return (AL_GRADES as readonly string[]).includes(grade);
}

/** The valid sub-divisions (classes or streams) for a given grade. */
export function getSubDivisions(grade: string): readonly SubDivision[] {
  return isALGrade(grade) ? AL_STREAMS : OL_CLASSES;
}
