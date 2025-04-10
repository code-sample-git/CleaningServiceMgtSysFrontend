// Mock users data with expanded roles
const mockUsers = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
    phone: "123-456-7890",
    status: "active"
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "manager@example.com",
    password: "password123",
    role: "manager",
    phone: "123-456-7891",
    status: "active"
  },
  {
    id: 3,
    firstName: "Bob",
    lastName: "Wilson",
    email: "staff@example.com",
    password: "password123",
    role: "staff",
    phone: "123-456-7892",
    status: "active"
  },
  {
    id: 4,
    firstName: "Alice",
    lastName: "Johnson",
    email: "client@example.com",
    password: "password123",
    role: "client",
    phone: "123-456-7893",
    status: "active"
  }
];

// Mock locations data
const mockLocations = [
  {
    id: 1,
    name: "Office Building A",
    address: "123 Main St, City, State 12345",
    clientId: 4,
    assignedStaff: [3],
    tasks: [1, 2, 3],
    status: "active"
  },
  {
    id: 2,
    name: "Shopping Mall B",
    address: "456 Market St, City, State 12345",
    clientId: 4,
    assignedStaff: [3],
    tasks: [1, 4],
    status: "active"
  }
];

// Mock tasks data
const mockTasks = [
  {
    id: 1,
    name: "General Cleaning",
    description: "Regular cleaning of all areas",
    frequency: "daily",
    estimatedDuration: 120, // in minutes
    price: 100
  },
  {
    id: 2,
    name: "Floor Maintenance",
    description: "Floor cleaning and waxing",
    frequency: "weekly",
    estimatedDuration: 180,
    price: 250
  },
  {
    id: 3,
    name: "Window Cleaning",
    description: "Clean all windows",
    frequency: "weekly",
    estimatedDuration: 90,
    price: 150
  },
  {
    id: 4,
    name: "Deep Cleaning",
    description: "Thorough cleaning of all areas",
    frequency: "monthly",
    estimatedDuration: 360,
    price: 500
  }
];

// Mock QA reports data
const mockQAReports = [
  {
    id: 1,
    locationId: 1,
    inspectorId: 2,
    date: "2024-03-15",
    rating: 4.5,
    comments: "Good overall cleanliness, minor issues in break room",
    items: [
      { category: "Floors", rating: 5, comments: "Excellent condition" },
      { category: "Windows", rating: 4, comments: "Some streaks visible" }
    ]
  },
  {
    id: 2,
    locationId: 2,
    inspectorId: 2,
    date: "2024-03-14",
    rating: 4.0,
    comments: "Satisfactory cleaning, needs attention to details",
    items: [
      { category: "Floors", rating: 4, comments: "Good condition" },
      { category: "Windows", rating: 4, comments: "Acceptable" }
    ]
  }
];

// Mock time entries data
const mockTimeEntries = [
  {
    id: 1,
    userId: 3,
    locationId: 1,
    clockIn: "2024-03-15T08:00:00",
    clockOut: "2024-03-15T16:00:00",
    tasks: [1, 2],
    status: "completed"
  },
  {
    id: 2,
    userId: 3,
    locationId: 2,
    clockIn: "2024-03-14T09:00:00",
    clockOut: "2024-03-14T17:00:00",
    tasks: [1, 4],
    status: "completed"
  }
];

// Mock inventory data
const mockInventory = [
  {
    id: 1,
    name: "All-Purpose Cleaner",
    quantity: 15,
    minQuantity: 10,
    unit: "bottles",
    category: "Cleaning Supplies"
  },
  {
    id: 2,
    name: "Paper Towels",
    quantity: 8,
    minQuantity: 20,
    unit: "rolls",
    category: "Paper Products"
  }
];

// Mock supplies data
const mockSupplies = [
  {
    id: 1,
    name: "Vacuum Cleaner",
    condition: "good",
    lastMaintenance: "2024-02-15",
    nextMaintenance: "2024-05-15",
    assignedTo: 3
  },
  {
    id: 2,
    name: "Floor Buffer",
    condition: "needs maintenance",
    lastMaintenance: "2024-01-15",
    nextMaintenance: "2024-04-15",
    assignedTo: 3
  }
];

// Mock proposals data
const mockProposals = [
  {
    id: 1,
    clientId: 4,
    locations: [1],
    frequency: "weekly",
    totalAmount: 500,
    status: "pending",
    createdDate: "2024-03-10",
    notes: "Weekly cleaning service for office building"
  },
  {
    id: 2,
    clientId: 4,
    locations: [2],
    frequency: "monthly",
    totalAmount: 1200,
    status: "approved",
    createdDate: "2024-03-01",
    notes: "Monthly deep cleaning service for shopping mall"
  }
];

// Initialize localStorage with mock data
const initializeMockData = () => {
  localStorage.setItem('users', JSON.stringify(mockUsers));
  localStorage.setItem('locations', JSON.stringify(mockLocations));
  localStorage.setItem('tasks', JSON.stringify(mockTasks));
  localStorage.setItem('qaReports', JSON.stringify(mockQAReports));
  localStorage.setItem('timeEntries', JSON.stringify(mockTimeEntries));
  localStorage.setItem('inventory', JSON.stringify(mockInventory));
  localStorage.setItem('supplies', JSON.stringify(mockSupplies));
  localStorage.setItem('proposals', JSON.stringify(mockProposals));
};

// Services
const createService = (key) => ({
  getAll: () => JSON.parse(localStorage.getItem(key) || '[]'),
  getById: (id) => JSON.parse(localStorage.getItem(key) || '[]').find(item => item.id === id),
  create: (item) => {
    const items = JSON.parse(localStorage.getItem(key) || '[]');
    const newItem = { ...item, id: items.length + 1 };
    items.push(newItem);
    localStorage.setItem(key, JSON.stringify(items));
    return newItem;
  },
  update: (id, updates) => {
    const items = JSON.parse(localStorage.getItem(key) || '[]');
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      localStorage.setItem(key, JSON.stringify(items));
      return items[index];
    }
    return null;
  },
  delete: (id) => {
    const items = JSON.parse(localStorage.getItem(key) || '[]');
    const filtered = items.filter(item => item.id !== id);
    localStorage.setItem(key, JSON.stringify(filtered));
  }
});

// Initialize data
initializeMockData();

// Export services
export const authService = {
  ...createService('users'),
  login: (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return { success: true, user: userWithoutPassword };
    }
    return { success: false, error: 'Invalid credentials' };
  },
  logout: () => {
    localStorage.removeItem('currentUser');
  },
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('currentUser'));
  }
};

export const locationService = {
  ...createService('locations'),
  getByClient: (clientId) => {
    return JSON.parse(localStorage.getItem('locations') || '[]')
      .filter(location => location.clientId === clientId);
  }
};

export const taskService = createService('tasks');
export const qaService = createService('qaReports');
export const timeEntryService = {
  ...createService('timeEntries'),
  getByUser: (userId) => {
    return JSON.parse(localStorage.getItem('timeEntries') || '[]')
      .filter(entry => entry.userId === userId);
  }
};
export const inventoryService = createService('inventory');
export const supplyService = createService('supplies');
export const proposalService = {
  ...createService('proposals'),
  getByClient: (clientId) => {
    return JSON.parse(localStorage.getItem('proposals') || '[]')
      .filter(proposal => proposal.clientId === clientId);
  },
  updateStatus: (id, status) => {
    const proposals = JSON.parse(localStorage.getItem('proposals') || '[]');
    const index = proposals.findIndex(p => p.id === id);
    if (index !== -1) {
      proposals[index].status = status;
      localStorage.setItem('proposals', JSON.stringify(proposals));
      return proposals[index];
    }
    return null;
  }
}; 