const schoolSchema = {
    name: {
        type: "string",
        required: true,
        messages: {
            "string.base": "School name must be a string.",
            "any.required": "School name is required.",
        },
    },
    location: {
        type: "object",
        required: true,
        messages: {
            "string.base": "Location must be a object.",
            "any.required": "Location is required.",
        },
    },
    email: {
        type: "string",
        required: true,
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        messages: {
            "string.base": "Email must be a string.",
            "any.required": "Email is required.",
            "string.pattern.base": "Invalid email format.",
        },
    },
    website: {
        type: "string",
        uri: true,
        messages: {
            "string.base": "Website must be a string.",
            "string.uri": "Invalid website URL format.",
        },
    },
    foundedYear: {
        type: "number",
        required: true,
        min: 1800,
        max: new Date().getFullYear(),
        messages: {
            "number.base": "Founded year must be a number.",
            "any.required": "Founded year is required.",
            "number.min": "Founded year must be greater than or equal to 1800.",
            "number.max": `Founded year must be less than or equal to the current year (${new Date().getFullYear()}).`,
        },
    },
    principalName: {
        type: "string",
        required: true,
        messages: {
            "string.base": "Principal name must be a string.",
            "any.required": "Principal name is required.",
        },
    },
    isPrivate: {
        type: "boolean",
        required: true,
        messages: {
            "boolean.base": "IsPrivate must be a boolean.",
            "any.required": "IsPrivate is required.",
        },
    },
    accreditation: {
        type: "boolean",
        required: false,
        messages: {
            "string.base": "Accreditation must be a string.",
        },
    },
    phoneNumber: {
        type: "string",
        required: true,
        pattern: /^\d{10}$/,
        messages: {
            "string.base": "Phone number must be a string.",
            "any.required": "Phone number is required.",
            "string.pattern.base": "Phone number must be a 10-digit number.",
        },
    },
    password: {
        type: "string",
        required: true,
        pattern:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        messages: {
            "string.base": "Password must be a string.",
            "any.required": "Password is required.",
            "string.pattern.base":"Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character.",
        },
    },
};


const validateSchoolData = (data) => {
    // console.log(data);
    const errors = [];

    // Helper function to push an error message to the errors array
    const pushError = (field, message) => {
        errors.push({ field, message });
    };

    // Validate each field based on the schema
    for (const field in schoolSchema) {
        if (schoolSchema.hasOwnProperty(field)) {
            const fieldSchema = schoolSchema[field];
            const value = data[field];

            // Check if the field is required but not provided
            if (fieldSchema.required && (value === undefined || value === null || value === "")) {
                pushError(field, fieldSchema.messages["any.required"] || `${field} is required.`);
                continue;
            }

            // Check if the field is of the correct type
            if (fieldSchema.type && typeof value !== fieldSchema.type) {
                pushError(field, fieldSchema.messages["string.base"] ||`${field} must be a ${fieldSchema.type}.`);
                continue;
            }

            // Check if the field matches the regex pattern (if specified)
            if (fieldSchema.pattern && !fieldSchema.pattern.test(value)) {
                pushError(field, fieldSchema.messages["string.pattern.base"] || `Invalid ${field}.`);
            }

            if (field === "location") {
                if (!value || typeof value !== "object") {
                    pushError(field, fieldSchema.messages["object.base"] || "Invalid location format.");
                } else {
                    const locationErrors = validateLocationFields(value);
                    if (locationErrors) {
                        errors.push(...locationErrors);
                    }
                }
                continue;
            }
            if (field === "foundedYear") {
                if (isNaN(data.foundedYear)) {
                    pushError("foundedYear", foundedYearSchema.messages["number.base"] || "Founded year must be a number.");
                } else if (data.foundedYear < fieldSchema.min || data.foundedYear > fieldSchema.max) {
                    console.log(data.foundedYear, fieldSchema.min, fieldSchema.max)
                    pushError(
                        "foundedYear",`Founded year must be between ${fieldSchema.min} and ${fieldSchema.max}.`
                    );
                }
            }
        }
    }

    return errors.length > 0 ? errors : null;;
};

const validateLocationFields = (location) => {
    const { address, city, state, zip } = location;
    const locationErrors = [];

    if (typeof address !== "string" || typeof city !== "string" || typeof state !== "string" || typeof zip !== "string") {
        locationErrors.push({ field: "location", message: "Location fields must be strings." });
    }

    if (!address || !city || !state || !zip) {
        locationErrors.push({ field: "location", message: "Location is incomplete." });
    }

    return locationErrors.length === 0 ? null : locationErrors;
};

export { validateSchoolData };
