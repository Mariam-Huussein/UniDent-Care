export const cityMap: Record<string, number> = {
  "Cairo": 0,
  "Giza": 1,
  "Alexandria": 2,
  "Luxor": 3,
  "Aswan": 4,
  "Tanta": 5,
  "Mansoura": 6,
  "Zagazig": 7,
  "Suez": 8,
  "PortSaid": 9
};

export const cityList: string[] = Object.keys(cityMap);

export enum Gender {
  Male = 0,
  Female = 1
}

export const genderList: string[] = [Gender[Gender.Male], Gender[Gender.Female]];
