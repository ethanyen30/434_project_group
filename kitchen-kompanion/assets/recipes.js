const RECIPES = [
  {
    id: "spaghetti-bolognese",
    name: "Spaghetti Bolognese",
    prepMins: 15,
    cookMins: 30,
    difficulty: "Medium",
    servings: 4,
    tags: [],
    allergens: ["gluten", "dairy"],
    ingredients: [
      { name: "Spaghetti", qty: 1, unit: "lb" },
      { name: "Ground Beef", qty: 1, unit: "lb" },
      { name: "Tomato Sauce", qty: 24, unit: "oz" },
      { name: "Onion", qty: 1, unit: "count" },
      { name: "Garlic", qty: 2, unit: "clove" },
      { name: "Olive Oil", qty: 2, unit: "tbsp" },
      { name: "Parmesan", qty: 4, unit: "oz" }
    ],
    steps: [
      "Cook the spaghetti in salted water until al dente.",
      "Cook the onion and garlic in olive oil until softened.",
      "Brown the ground beef, breaking it up as it cooks.",
      "Stir in the tomato sauce and simmer for 20 minutes.",
      "Toss the pasta with the sauce and serve with Parmesan."
    ]
  },
  {
    id: "chicken-stir-fry",
    name: "Chicken Stir Fry",
    prepMins: 20,
    cookMins: 15,
    difficulty: "Medium",
    servings: 4,
    tags: ["gluten-free", "dairy-free"],
    allergens: ["soy"],
    ingredients: [
      { name: "Chicken Breasts", qty: 1.5, unit: "lb" },
      { name: "Broccoli", qty: 2, unit: "cup" },
      { name: "Bell Pepper", qty: 1, unit: "count" },
      { name: "Jasmine Rice", qty: 2, unit: "cup" },
      { name: "Olive Oil", qty: 2, unit: "tbsp" },
      { name: "Tamari", qty: 3, unit: "tbsp" },
      { name: "Garlic", qty: 2, unit: "clove" }
    ],
    steps: [
      "Cook the Jasmine Rice according to the package directions.",
      "Slice the chicken and vegetables into bite-sized pieces.",
      "Brown the chicken in olive oil.",
      "Add the vegetables and garlic; stir-fry until crisp-tender.",
      "Stir in the tamari and serve over the rice."
    ]
  },
  {
    id: "creamy-garlic-pasta",
    name: "Creamy Garlic Pasta",
    prepMins: 10,
    cookMins: 15,
    difficulty: "Easy",
    servings: 2,
    tags: ["vegetarian"],
    allergens: ["gluten", "dairy"],
    ingredients: [
      { name: "Pasta (Penne)", qty: 8, unit: "oz" },
      { name: "Olive Oil", qty: 1, unit: "tbsp" },
      { name: "Garlic", qty: 3, unit: "clove" },
      { name: "Heavy Cream", qty: 1, unit: "cup" },
      { name: "Parmesan", qty: 2, unit: "oz" },
      { name: "Black Pepper", qty: 0.5, unit: "tsp" }
    ],
    steps: [
      "Cook the pasta until al dente and reserve some pasta water.",
      "Sauté the garlic in olive oil until fragrant.",
      "Add the cream and simmer gently.",
      "Stir in Parmesan and black pepper.",
      "Toss with the pasta, adding pasta water as needed."
    ]
  },
  {
    id: "black-bean-tacos",
    name: "Black Bean Tacos",
    prepMins: 10,
    cookMins: 10,
    difficulty: "Easy",
    servings: 3,
    tags: ["vegetarian", "gluten-free"],
    allergens: ["dairy"],
    ingredients: [
      { name: "Canned Black Beans", qty: 1, unit: "can" },
      { name: "Corn Tortillas", qty: 6, unit: "count" },
      { name: "Olive Oil", qty: 1, unit: "tbsp" },
      { name: "Tomato", qty: 1, unit: "count" },
      { name: "Onion", qty: 0.5, unit: "count" },
      { name: "Cheddar Cheese", qty: 3, unit: "oz" },
      { name: "Cumin", qty: 1, unit: "tsp" }
    ],
    steps: [
      "Drain and rinse the black beans.",
      "Cook the onion in olive oil until softened.",
      "Add beans and cumin, then warm through.",
      "Warm the tortillas in a dry skillet.",
      "Fill tortillas and top with tomato and cheddar."
    ]
  },
  {
    id: "spicy-peanut-noodles",
    name: "Spicy Peanut Noodles",
    prepMins: 15,
    cookMins: 10,
    difficulty: "Easy",
    servings: 3,
    tags: ["vegetarian", "spicy"],
    allergens: ["gluten", "nuts", "soy"],
    ingredients: [
      { name: "Pasta (Penne)", qty: 8, unit: "oz" },
      { name: "Bell Pepper", qty: 1, unit: "count" },
      { name: "Garlic", qty: 2, unit: "clove" },
      { name: "Olive Oil", qty: 1, unit: "tbsp" },
      { name: "Tamari", qty: 2, unit: "tbsp" },
      { name: "Chili Flakes", qty: 1, unit: "tsp" }
    ],
    steps: [
      "Cook the pasta until tender and reserve a little pasta water.",
      "Sauté the bell pepper and garlic in olive oil.",
      "Stir in tamari and chili flakes.",
      "Toss with pasta and enough pasta water to coat.",
      "Serve warm with extra chili flakes."
    ]
  },
  {
    id: "roasted-vegetable-bowl",
    name: "Roasted Vegetable Bowl",
    prepMins: 15,
    cookMins: 30,
    difficulty: "Easy",
    servings: 4,
    tags: ["vegetarian", "gluten-free", "dairy-free"],
    allergens: [],
    ingredients: [
      { name: "Jasmine Rice", qty: 2, unit: "cup" },
      { name: "Broccoli", qty: 2, unit: "cup" },
      { name: "Bell Pepper", qty: 1, unit: "count" },
      { name: "Canned Black Beans", qty: 1, unit: "can" },
      { name: "Olive Oil", qty: 2, unit: "tbsp" },
      { name: "Chili Flakes", qty: 0.5, unit: "tsp" }
    ],
    steps: [
      "Cook the rice until tender.",
      "Toss broccoli and bell pepper with olive oil and chili flakes.",
      "Roast vegetables until browned and tender.",
      "Warm the black beans.",
      "Build bowls with rice, vegetables, and beans."
    ]
  },
  {
    id: "herb-roasted-chicken",
    name: "Herb Roasted Chicken",
    prepMins: 20,
    cookMins: 45,
    difficulty: "Hard",
    servings: 4,
    tags: ["gluten-free", "dairy-free"],
    allergens: [],
    ingredients: [
      { name: "Chicken Breasts", qty: 2, unit: "lb" },
      { name: "Olive Oil", qty: 2, unit: "tbsp" },
      { name: "Garlic", qty: 3, unit: "clove" },
      { name: "Onion", qty: 1, unit: "count" },
      { name: "Black Pepper", qty: 1, unit: "tsp" }
    ],
    steps: [
      "Heat the oven and season the chicken with olive oil, garlic, and pepper.",
      "Arrange chicken and onion in a roasting dish.",
      "Roast until the chicken reaches a safe internal temperature.",
      "Rest the chicken for 10 minutes.",
      "Slice and serve with the roasted onion."
    ]
  },
  {
    id: "lentil-vegetable-soup",
    name: "Lentil Vegetable Soup",
    prepMins: 15,
    cookMins: 40,
    difficulty: "Medium",
    servings: 5,
    tags: ["vegetarian", "gluten-free", "dairy-free"],
    allergens: [],
    ingredients: [
      { name: "Canned Black Beans", qty: 1, unit: "can" },
      { name: "Onion", qty: 1, unit: "count" },
      { name: "Garlic", qty: 2, unit: "clove" },
      { name: "Carrot", qty: 2, unit: "count" },
      { name: "Olive Oil", qty: 1, unit: "tbsp" },
      { name: "Chili Flakes", qty: 0.25, unit: "tsp" }
    ],
    steps: [
      "Sauté onion, carrot, and garlic in olive oil.",
      "Add beans, chili flakes, and enough water to cover.",
      "Simmer until the vegetables are tender.",
      "Season to taste and simmer for 5 more minutes.",
      "Serve hot with a drizzle of olive oil."
    ]
  }
];
