import Organization from "./Organization.Model";
import User from "./User.Model";

export default interface Tutor extends User {
    availability: string;
    summary?: string;
    hourlyrate: number;
    organization: Organization,
    averagerating: number;
}