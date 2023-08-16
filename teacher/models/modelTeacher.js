export const validateBasicTeacherData = (data) => {
    const requiredFields = [
        { field: "firstName", type: "string" },
        { field: "lastName", type: "string" },
        {
            field: "gender",
            type: "string",
            validValues: ["male", "female", "other"],
        },
        { field: "dateOfBirth", type: "string", regex: /^\d{4}-\d{2}-\d{2}$/ },
        {
            field: "email",
            type: "string",
            regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        },
        { field: "phoneNumber", type: "string", regex: /^\d{10}$/ },
        { field: "password", type: "string" },
    ];

    const errors = [];

    for (const { field, type, validValues, regex } of requiredFields) {
        if (!data[field]) {
        errors.push(`Missing ${field}`);
        } else if (type && typeof data[field] !== type) {
        errors.push(`Invalid ${field} type`);
        } else if (validValues && !validValues.includes(data[field])) {
        errors.push(`Invalid ${field} value`);
        } else if (regex && !regex.test(data[field])) {
        errors.push(`Invalid ${field}`);
        }
    }

    return errors.length > 0 ? errors : null;
};
