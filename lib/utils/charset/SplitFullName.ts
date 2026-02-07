export default function splitFullName(name: string): {
    firstName: string;
    lastName: string;
} {
    const parts = name.trim().split(/\s+/);
    if(parts.length === 1) {
        return {
            firstName: parts[0],
            lastName: "",
        };
    }

    return {
        firstName: parts[0],
        lastName: parts.slice(1).join(" "),
    }
}