import { useState } from 'react';

import InputField from '../../../shared/components/atoms/InputField';
import SelectField from '../../../shared/components/atoms/SelectField';
import Button from '../../../shared/components/atoms/Button';
import Alert from '../../../shared/components/molecules/Alert';

import SocialButtons from './SocialButtons';

function RegisterForm() {

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        country: '',
        birthDate: '',
        identification: '',
        phone: '',
        password: '',
    });

    const [errors, setErrors] = useState({});

    const [success, setSuccess] = useState(false);

    const [loading, setLoading] = useState(false);

    const countries = [
        { value: 'Colombia', label: 'Colombia' },
        { value: 'México', label: 'México' },
        { value: 'Argentina', label: 'Argentina' },
        { value: 'Chile', label: 'Chile' },
        { value: 'Perú', label: 'Perú' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: '',
        }));
    };

    const validateForm = () => {

        const newErrors = {};

        if (!form.fullName.trim()) {
            newErrors.fullName = 'El nombre es obligatorio';
        }

        if (!form.email.trim()) {
            newErrors.email = 'El correo es obligatorio';
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)
        ) {
            newErrors.email = 'Correo inválido';
        }

        if (!form.country) {
            newErrors.country = 'Seleccione un país';
        }

        if (!form.birthDate) {
            newErrors.birthDate = 'Seleccione una fecha';
        }

        if (!form.identification.trim()) {
            newErrors.identification = 'Ingrese su identificación';
        }

        if (!form.phone.trim()) {
            newErrors.phone = 'Ingrese su celular';
        }

        if (!form.password) {
            newErrors.password = 'Ingrese una contraseña';
        } else if (form.password.length < 8) {
            newErrors.password =
                'La contraseña debe tener mínimo 8 caracteres';
        }

        return newErrors;
    };

    const handleSubmit = (e) => {

        e.preventDefault();

        const validation = validateForm();

        if (Object.keys(validation).length > 0) {
            setErrors(validation);
            setSuccess(false);
            return;
        }

        setErrors({});

        setLoading(true);

        setTimeout(() => {

            setLoading(false);

            setSuccess(true);

            alert('Registro exitoso como Beta Tester');

            console.log(form);

        }, 2000);
    };
    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl space-y-5 rounded-xl bg-white p-8 shadow-lg"
        >
            {success && (
                <Alert variant="success">
                    ¡Registro exitoso! Ya eres un Beta Tester.
                </Alert>
            )}

            <InputField
                label="Nombre completo"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                error={errors.fullName}
                required
            />

            <InputField
                label="Correo electrónico"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                required
            />

            <SelectField
                label="País"
                name="country"
                value={form.country}
                onChange={handleChange}
                options={countries}
                error={errors.country}
                required
            />

            <InputField
                label="Fecha de nacimiento"
                name="birthDate"
                type="date"
                value={form.birthDate}
                onChange={handleChange}
                error={errors.birthDate}
                required
            />

            <InputField
                label="Número de identificación"
                name="identification"
                value={form.identification}
                onChange={handleChange}
                error={errors.identification}
                required
            />

            <InputField
                label="Número de celular"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                error={errors.phone}
                required
            />

            <InputField
                label="Contraseña"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
                required
                minLength={8}
            />

            <Button
                type="submit"
                loading={loading}
                disabled={loading}
                className="w-full"
            >
                {loading ? 'Registrando...' : 'Registrarse Beta Tester'}
            </Button>

            <SocialButtons />
        </form>
    );
}

export default RegisterForm;