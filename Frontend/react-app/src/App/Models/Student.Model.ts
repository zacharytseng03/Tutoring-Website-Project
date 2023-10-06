import User from "./User.Model";

export default interface Student extends User {
    school: string;
    gradelevel: string;
}