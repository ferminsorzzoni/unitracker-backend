import type { User } from "../../../types/user.js";
import * as subjectRepository from "./subject.repository.js";
import type { CreateSubjectDTO, UpdateSubjectDTO } from "./subject.types.js";

async function create(subject: CreateSubjectDTO) {

}

async function findById(subjectId: string) {

}

async function update(subject: UpdateSubjectDTO, subjectId: string) {

}

async function remove(subjectId: string) {

}

async function checkSubjectOwnership(subjectId: string, user: User) {

}

export { create, findById, update, remove, checkSubjectOwnership };