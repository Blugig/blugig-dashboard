export const PERMISSIONS = [
    { name: "Solution Implementation", code: "SOL" },
    { name: "API Integration", code: "API" },
    { name: "Hire Smartsheet Expert", code: "EXP" },
    { name: "System Admin Support", code: "ADM" },
    { name: "Adhoc Request", code: "ADH" },
    { name: "Premium App Support", code: "PRM" },
    { name: "Book One on One", code: "ONE" },
    { name: "PMO Control Center", code: "PMO" },
    { name: "License Request", code: "LIR" },
];

export const getPermName = (code) => {
    for (let i = 0; i < PERMISSIONS.length; i++) {
        if (PERMISSIONS[i].code === code) {
            return PERMISSIONS[i].name;
        }
    }
}