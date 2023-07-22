const filterSpace = (value) => {
  return value
    .split(" ")
    .filter((item) => item.length > 0)
    .join(" ");
};

const capitalizeName = (name) => {
  if (filterSpace(name) === "") return "";
  return filterSpace(name)
    .toLocaleLowerCase()
    .split(" ")
    .map((item) => {
      const name = item.slice(1, item.length);
      const firstLetter = item[0].toUpperCase();
      return firstLetter + name;
    })
    .join(" ");
};

const parseFullName = (firstName, lastName) => {
  if (capitalizeName(firstName) === "") return capitalizeName(lastName);
  if (capitalizeName(lastName) === "") return capitalizeName(firstName);
  return `${capitalizeName(firstName)} ${capitalizeName(lastName)}`;
};

module.exports = {
  capitalizeName,
  parseFullName,
};
