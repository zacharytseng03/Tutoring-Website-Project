import Location from "./Location.Model";

export default interface User {
    firstname: string;
    lastname: string;
    email: string;
    phonenum: string;
    datejoined: string;
    location: Location;
}