const validateClassData = (data) => {
    const requiredFields = [
        { field: "schoolId", type: "string", length: 10 },
        { field: "className", type: "string" },
        { field: "classSectionName", type: "string" },
        { field: "classTeacherId", type: "string", length: 10 },
    ];

    const errors = [];

    for (const { field, type, length } of requiredFields) {
        
        if (!data[field]) {
            errors.push(`Missing ${field}`);
        } else if (type && typeof data[field] !== type) {
            errors.push(`Invalid ${field} type`);
        } else if (length && data[field].length !== length) {
            errors.push(`Invalid ${field} length`);
        }
    }

    return errors.length > 0 ? errors : null;
};

export { validateClassData };
