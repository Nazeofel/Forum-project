export function splitStr(str: string, index: number): Array<string> {
  const strArr: Array<string> = [];
  if (str.length > index) {
    for (let i = 0; i <= index; i++) {
      strArr.push(str[i]);
    }

    strArr.push("...");
    return [...strArr];
  }

  strArr.push(str);
  return [...strArr];
}
