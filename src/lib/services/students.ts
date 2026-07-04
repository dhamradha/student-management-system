import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  type QueryConstraint,
} from "firebase/firestore";

import { db } from "@/lib/firebase/client";
import type { AcademicData, GuardianData, StudentRecord } from "@/types";
import type { StudentInput } from "@/lib/validations/student";

const studentsCol = collection(db, "students");

function studentRef(id: string) {
  return doc(db, "students", id);
}

/** Split the flat form input into the nested academic / guardian shape. */
function toNested(input: StudentInput): {
  academicData: AcademicData;
  guardianData: GuardianData;
} {
  return {
    academicData: {
      fullName: input.fullName,
      nameWithInitials: input.nameWithInitials,
      admissionNo: input.admissionNo,
      grade: input.grade,
      classStream: input.classStream,
      dob: input.dob,
      gender: input.gender,
    },
    guardianData: {
      guardianName: input.guardianName,
      contactNo: input.contactNo,
      address: input.address,
      emergencyName: input.emergencyName,
      emergencyPhone: input.emergencyPhone,
    },
  };
}

/** Flatten a stored record back into form-friendly values (for editing). */
export function toFormValues(record: StudentRecord): StudentInput {
  return { ...record.academicData, ...record.guardianData } as StudentInput;
}

export async function studentExists(admissionNo: string): Promise<boolean> {
  const snap = await getDoc(studentRef(admissionNo));
  return snap.exists();
}

export async function createStudent(
  input: StudentInput,
  createdBy: string,
  createdByName: string,
): Promise<void> {
  const id = input.admissionNo;
  if (await studentExists(id)) {
    throw new Error("A student with this admission number already exists.");
  }
  const now = new Date().toISOString();
  const record: StudentRecord = {
    id,
    ...toNested(input),
    createdBy,
    createdByName,
    createdAt: now,
    updatedAt: now,
  };
  await setDoc(studentRef(id), record);
}

export async function updateStudent(
  id: string,
  input: StudentInput,
): Promise<void> {
  await updateDoc(studentRef(id), {
    ...toNested(input),
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteStudent(id: string): Promise<void> {
  await deleteDoc(studentRef(id));
}

export async function getStudent(id: string): Promise<StudentRecord | null> {
  const snap = await getDoc(studentRef(id));
  return snap.exists() ? (snap.data() as StudentRecord) : null;
}

interface StudentFilters {
  grade?: string;
  classStream?: string;
}

export async function listStudents(
  filters: StudentFilters = {},
): Promise<StudentRecord[]> {
  const constraints: QueryConstraint[] = [];
  if (filters.grade) {
    constraints.push(where("academicData.grade", "==", filters.grade));
  }
  if (filters.classStream) {
    constraints.push(
      where("academicData.classStream", "==", filters.classStream),
    );
  }
  const snap = await getDocs(query(studentsCol, ...constraints));
  return snap.docs.map((d) => d.data() as StudentRecord);
}
