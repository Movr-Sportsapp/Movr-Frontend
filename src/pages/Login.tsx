import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { LoginInput } from '../types/User';


export default function LoginPage() {

const [form, setForm] = useState<LoginInput>({

    identifier: "",
    password: "",
});

const { login } = useAuth();
const navigate = useNavigate();



    return <h1>Login Page!</h1>;
}