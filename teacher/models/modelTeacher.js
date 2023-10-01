export const validateBasicTeacherData = (data) => {
    const requiredFields = [
        { field: "name", type: "string" },
        { field: "dateOfBirth", type: "string", regex: /^\d{4}-\d{2}-\d{2}$/ },
        {
            field: "emailId",
            type: "string",
            regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        },
        { field: "phoneNumber", type: "string", regex: /^\d{10}$/ },
        {
            field: "gender",
            type: "string",
            validValues: ["male", "female", "other"],
        },
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
