const validateClassData = (data) => {
    const requiredFields = [
        { field: "schoolId", type: "string", length: 10 },
        { field: "sectionName", type: "string" },
        { field: "className", type: "string" },
        { field: "classTeacherId", type: "string", length: 10 },
        { field: "teachers", type: "object", arrayType: "string" },
        { field: "students", type: "object", arrayType: "string" }
    ];

    const errors = [];

    for (const { field, type, length, arrayType } of requiredFields) {
        
        if (!data[field]) {
            errors.push(`Missing ${field}`);
        } else if (type && typeof data[field] !== type) {
            errors.push(`Invalid ${field} type`);
        } else if (length && data[field].length !== length) {
            errors.push(`Invalid ${field} length`);
        } else if (arrayType && !Array.isArray(data[field])) {
            errors.push(`Invalid ${field} type (array expected)`);
        } else if (arrayType && !data[field].every(item => typeof item === arrayType)) {
            errors.push(`Invalid ${field} array item type`);
        }
    }

    return errors.length > 0 ? errors : null;
};

export { validateClassData };
