import { ValidatorFn } from '@angular/forms';

interface StrongPasswordErrors {
  lowerCase?: boolean;
  upperCase?: boolean;
  number?: boolean;
  tooShort?: boolean;
  specialChar?: boolean;
}

export function strongPasswordValidator(): ValidatorFn {
  return (control) => {
    const value = control.value;

    // traitement

    const resultat: StrongPasswordErrors = {};

    // lowecase
    const lowerCaseRegex = /.*?[a-z]/;
    if (!lowerCaseRegex.test(value)) {
      resultat.lowerCase = true;
    }

    // uppercase
    const upperCaseRegex = /.*?[A-Z]/;
    if (!upperCaseRegex.test(value)) {
      resultat.upperCase = true;
    }

    // number
    const numberRegex = /.*?[0-9]/;
    if (!numberRegex.test(value)) {
      resultat.number = true;
    }

    // special char
    const specialCharRegex = /.*?[\W_]/;
    if (!specialCharRegex.test(value)) {
      resultat.specialChar = true;
    }

    // min length 8
    if (value?.length < 8) {
      resultat.tooShort = true;
    }

    // si on a des erreurs, on les retourne
    if (Object.keys(resultat).length > 0) {
      return resultat;
    }

    // strong password
    return null;
  };
}
