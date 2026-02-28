import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Patient {
    age: bigint;
    exerciseInducedAngina: boolean;
    maxHeartRate: bigint;
    chestPain: ChestPainType;
    majorVessels: bigint;
    race: Race;
    thal: Thalassemia;
    restingBP: bigint;
    slope: bigint;
    gender: Gender;
    stDepression: number;
    heartDisease: boolean;
    strokeHistory: boolean;
    diabetes: boolean;
    fastingBloodSugar: boolean;
    restingECG: bigint;
    cholesterol: bigint;
}
export enum ChestPainType {
    atypicalAngina = "atypicalAngina",
    typicalAngina = "typicalAngina",
    asymptomatic = "asymptomatic",
    nonAnginalPain = "nonAnginalPain"
}
export enum Gender {
    female = "female",
    male = "male"
}
export enum Race {
    asian = "asian",
    other = "other",
    latino = "latino",
    black = "black",
    white = "white"
}
export enum Thalassemia {
    normal = "normal",
    fixedDefect = "fixedDefect",
    reversibleDefect = "reversibleDefect"
}
export interface backendInterface {
    getConfiguration(): Promise<{
        ageMax: bigint;
        ageMin: bigint;
    }>;
    getDatasetSize(): Promise<bigint>;
    getFilteredPatients(minAge: bigint, maxAge: bigint, gender: Gender | null, race: Race | null, diabetes: boolean | null, strokeHistory: boolean | null): Promise<Array<Patient>>;
}
