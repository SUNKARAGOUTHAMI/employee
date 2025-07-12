let employees = [
    {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@company.com",
        department: "IT",
        role: "Developer"
    },
    {
        id: 2,
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@company.com",
        department: "HR",
        role: "Manager"
    },
    {
        id: 3,
        firstName: "Michael",
        lastName: "Johnson",
        email: "michael.johnson@company.com",
        department: "Finance",
        role: "Analyst"
    },
  
];

// Function to get next available ID
function getNextId() {
    return employees.length > 0 ? Math.max(...employees.map(emp => emp.id)) + 1 : 1;
}
