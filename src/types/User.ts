

// What the backend sends back
export type User = { 
  id: string; 
  firstName: string;
  lastName: string; 
  username: string;
  email: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'non-binary' | 'other' ;
  profileImage: string | null ;
  location: {
    city: string;
    country: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
};
  bio: string | null;
  sports: { sportId: string; skillLevel: string }[];
  createdAt: string;
};

export type SignUpInput = {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    dateOfBirth: string;
    gender:  'male' | 'female' | 'non-binary' | 'other' ;
    location: {
        city: string;
        country: string;
    };
};

export type LoginInput = {
    identifier: string; // See 'Api contract' - accepts either an email or a username
    password: string;
};

export type AuthResponse = {
  user: User ;
  message: string ;
};

