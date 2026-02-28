import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Bool "mo:core/Bool";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Float "mo:core/Float";
import Runtime "mo:core/Runtime";

actor {
  type Gender = { #male; #female };
  type Race = { #black; #white; #asian; #latino; #other };
  type ChestPainType = { #typicalAngina; #atypicalAngina; #nonAnginalPain; #asymptomatic };
  type Thalassemia = { #normal; #fixedDefect; #reversibleDefect };

  type Patient = {
    age : Nat;
    gender : Gender;
    race : Race;
    chestPain : ChestPainType;
    restingBP : Nat;
    cholesterol : Nat;
    fastingBloodSugar : Bool;
    restingECG : Nat;
    maxHeartRate : Nat;
    exerciseInducedAngina : Bool;
    stDepression : Float;
    slope : Nat;
    majorVessels : Nat;
    thal : Thalassemia;
    diabetes : Bool;
    strokeHistory : Bool;
    heartDisease : Bool;
  };

  type FilterOptions = {
    ageRange : (Nat, Nat);
    gender : ?Gender;
    race : ?Race;
    diabetes : ?Bool;
    strokeHistory : ?Bool;
  };

  func generateDataset(size : Nat) : [Patient] {
    if (size == 0) { return [] };
    let patients = Array.tabulate(
      size,
      func(i) {
        {
          age = 30 + (i % 40);
          gender = if (i % 2 == 0) { #male } else { #female };
          race = switch (i % 5) {
            case (0) { #black };
            case (1) { #white };
            case (2) { #asian };
            case (3) { #latino };
            case (_) { #other };
          };
          chestPain = switch (i % 4) {
            case (0) { #typicalAngina };
            case (1) { #atypicalAngina };
            case (2) { #nonAnginalPain };
            case (_) { #asymptomatic };
          };
          restingBP = 100 + (i % 50);
          cholesterol = 150 + (i % 100);
          fastingBloodSugar = i % 2 == 0;
          restingECG = i % 3;
          maxHeartRate = 100 + (i % 80);
          exerciseInducedAngina = i % 2 == 0;
          stDepression = Int.abs(i % 30).toFloat() / 10.0 + 0.5;
          slope = i % 3;
          majorVessels = i % 4;
          thal = switch (i % 3) {
            case (0) { #normal };
            case (1) { #fixedDefect };
            case (_) { #reversibleDefect };
          };
          diabetes = i % 4 == 0;
          strokeHistory = i % 5 == 0;
          heartDisease = i % 3 == 0 or i % 5 == 0 or i % 7 == 0;
        };
      },
    );
    patients;
  };

  let patientData = generateDataset(500);

  func applyFilter(patients : [Patient], filter : FilterOptions) : [Patient] {
    switch (patients.size()) {
      case (0) { return [] };
      case (_) {
        let iter = patients.values();
        let filteredIter = iter.filter(
          func(pat) {
            let inAgeRange = pat.age >= filter.ageRange.0 and pat.age <= filter.ageRange.1;
            let genderMatch = switch (filter.gender) {
              case (null) { true };
              case (?g) { pat.gender == g };
            };
            let raceMatch = switch (filter.race) {
              case (null) { true };
              case (?r) { pat.race == r };
            };
            let diabetesMatch = switch (filter.diabetes) {
              case (null) { true };
              case (?d) { pat.diabetes == d };
            };
            let strokeMatch = switch (filter.strokeHistory) {
              case (null) { true };
              case (?s) { pat.strokeHistory == s };
            };

            inAgeRange and genderMatch and raceMatch and diabetesMatch and strokeMatch;
          },
        );
        filteredIter.toArray();
      };
    };
  };

  public query ({ caller }) func getFilteredPatients(
    minAge : Nat,
    maxAge : Nat,
    gender : ?Gender,
    race : ?Race,
    diabetes : ?Bool,
    strokeHistory : ?Bool,
  ) : async [Patient] {
    if (minAge > maxAge) { Runtime.trap("Invalid age range") };
    if (patientData.size() == 0) { return [] };

    let filterOptions : FilterOptions = {
      ageRange = (minAge, maxAge);
      gender;
      race;
      diabetes;
      strokeHistory;
    };

    applyFilter(patientData, filterOptions);
  };

  public query ({ caller }) func getDatasetSize() : async Nat {
    patientData.size();
  };

  public query ({ caller }) func getConfiguration() : async {
    ageMin : Nat;
    ageMax : Nat;
  } {
    let ages = patientData.map(func(p) { p.age });
    let minAgeOption = ages.values().min();
    let maxAgeOption = ages.values().max();
    switch (minAgeOption, maxAgeOption) {
      case (?minAge, ?maxAge) {
        { ageMin = minAge; ageMax = maxAge };
      };
      case (_) {
        { ageMin = 0; ageMax = 0 };
      };
    };
  };
};
