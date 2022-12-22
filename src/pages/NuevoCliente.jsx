import { useNavigate, Form, useActionData, redirect } from 'react-router-dom';
import Error from '../components/Error';
import Formulario from '../components/Formulario';
import { agregarCliente } from '../data/clientes';

// request es una peticion que se le hace al action

export async function action({ request }) {
	const formData = await request.formData(); //pedir datos al form

	const datos = Object.fromEntries(formData); //leer datos del form

	const email = formData.get('email'); //obtener el valor del campo email por el name del form

	const nombre = formData.get('nombre');

	// validacion del form
	const errores = [];
	if (Object.values(datos).includes('')) {
		errores.push('Todos los campos son obligatorios');
	}

	let regex = new RegExp(
		"([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
	);
	if (!regex.test(email)) {
		errores.push('El email no es válido');
	}

	if (Object.keys(nombre).length < 3) {
		errores.push('El nombre debee poser 3 caracteres');
	}

	// retornar datos si hay errores
	if (Object.keys(errores).length) {
		return errores;
	}

	await agregarCliente(datos);

	return redirect('/');
}

function NuevoCliente() {
	const errores = useActionData();
	const navigate = useNavigate();

	return (
		<>
			<h1 className="font-black text-4xl text-blue-900">Nuevo Cliente</h1>
			<p className="mt-3">
				Completá el formulario para agregar un nuevo{' '}
				<span className="text-blue-900 font-bold">Cliente</span>
			</p>

			<div className="flex justify-end">
				<button
					className="bg-blue-800 text-white px-3 py-1 font-bold uppercase rounded-md"
					onClick={() => navigate('/')}
				>
					Volver
				</button>
			</div>
			<div className="bg-white shadow rounded-md md:w-3/4 mx-auto px-5 py-10 mt-10">
				{errores?.length &&
					errores.map((error, i) => <Error key={i}>{error}</Error>)}
				<Form
					method="post"
					noValidate
				>
					<Formulario />
					<input
						type="submit"
						className="mt-5 w-full bg-blue-800 p-3 uppercase font-bold text-white text-lg            hover:bg-blue-700 hover:cursor-pointer rounded-md"
						value="Registrar Cliente"
					/>
				</Form>
			</div>
		</>
	);
}

export default NuevoCliente;
