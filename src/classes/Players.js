export default class Player {
  constructor(id, name, avatar, hat) {
    this.id = id;
    this.name = name;
    this.avatar = avatar;
    this.hat = hat;
    this.score = 0;
    this.newScore = 0;
    this.rank = "NAN";
    this.didGuess = false;
  }
}
