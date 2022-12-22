import { obtenerCliente, actualizarCliente } from '../data/clientes';
import Formulario from '../components/Formulario';
import Error from '../components/Error';
import {
	Form,
	useNavigate,
	useLoaderData,
	useActionData,
	redirect,
} from 'react-router-dom';

export async function loader({ params }) {
	const cliente = await obtenerCliente(params.clienteId);
	if (Object.values(cliente).length === 0) {
		throw new Response('', {
			status: 404,
			statusText: 'Cliente no fue encontrado',
		});
	}
	return cliente;
}

export async function action({ request, params }) {
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

	await actualizarCliente(params.clienteId, datos);

	return redirect('/');
}

function EditarCliente() {
	const navigate = useNavigate();
	const cliente = useLoaderData();
	const errores = useActionData();

	return (
		<>
			<h1 className="font-black text-4xl text-blue-900">Editar Cliente</h1>
			<p className="mt-3">
				A continuacion podras modificar los datos {''}
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
					<Formulario cliente={cliente} />
					<input
						type="submit"
						className="mt-5 w-full bg-blue-800 p-3 uppercase font-bold text-white text-lg            hover:bg-blue-700 hover:cursor-pointer rounded-md"
						value="Guardar Cliente"
					/>
				</Form>
			</div>
		</>
	);
}

export default EditarCliente;
