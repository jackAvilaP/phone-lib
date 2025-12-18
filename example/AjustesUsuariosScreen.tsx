import { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from "../../router/store/hooks";
import { createUser } from '../../router/actions/userActions';
import { useNavigate } from 'react-router-dom';
import arrow from './../../assets/images/leftArrow.svg';
import tendycApi from '../../api/api';
import Swal from 'sweetalert2';
import { RootState } from '../../router/store/store';
import { Column, Table } from '../../form-components/table';
import Paginator from '../../form-components/paginator';
import { SearchBar } from '../../form-components/searchBar';
import PhoneLibReact from '@jacksonavila/phone-lib/react';
import '@jacksonavila/phone-lib/css';
import './AjustesScreen.css';

const AjustesUsuariosScreen = () => {
  // Vars, States & Hooks -------------------------------------------------------------------------------------------  
  const { shopInfo } = useAppSelector((state: RootState) => state.auth);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const phoneLibRef = useRef<any>(null);

  const countries = new Map([
    ['CO', '57'],
    ['PA', '507'],
    ['MX', '52'],
  ]);

  interface FormValues {
    nombre: string;
    usuario: string;
    phoneCode: string;
    telefono: string;
    direccion: string;
    permisos: string;
  }

  const [formValues, setFormValues] = useState<FormValues>({
    nombre: '',
    usuario: '',
    phoneCode: 'CO',
    telefono: '',
    direccion: '',
    permisos: '',
  });

  const [searchValue, setSearchValue] = useState<string>("");
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    searchValue: '',
    filters: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [paginated, setPaginated] = useState([]) as any;
  const [totalRecords, setTotalRecords] = useState(0);

  // Auxiliar functions ---------------------------------------------------------------------------------------------
  async function fetchData() {
    setIsLoading(true)
    const query = `?page=${paginationData.currentPage}&itemsPerPage=${paginationData.itemsPerPage}&search=${paginationData.searchValue}&filters=${encodeURIComponent(JSON.stringify(paginationData.filters))}`;
    const { data } = await tendycApi.get('users/list' + query);
    if (data.ok) {
      setPaginated(data.usuarios ?? [])
      setTotalRecords(data.totalRecords ?? 0)
    }
    setIsLoading(false)
  }

  const deleteUser = async (userId: string) => {
    try {
      const response = await tendycApi.delete(`users/delete/${userId}`);
      if (response.data.ok) {
        Swal.fire('Informacion', `Usuario eliminado exitosamente`, 'success');
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Effects --------------------------------------------------------------------------------------------------------
  useEffect(() => {
    if (!paginationData || isLoading) return;
    fetchData();
  }, [paginationData]);

  // Handlers -------------------------------------------------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const permisosItems = [] as any;
    document.getElementsByName('check_list[]').forEach((input) => {
      if (input instanceof HTMLInputElement && input.checked) {
        permisosItems.push(input.value);
      }
    });
    formValues.permisos = JSON.stringify(permisosItems);

    // Obtener el código de país del componente PhoneLib
    let phoneCodeNumber = '57'; // valor por defecto
    if (phoneLibRef.current) {
      const dialCode = phoneLibRef.current.getDialCode();
      // Remover el "+" del código de marcación
      phoneCodeNumber = dialCode.replace('+', '');
    } else {
      // Fallback al Map si PhoneLib no está disponible
      phoneCodeNumber = countries.get(formValues.phoneCode) || '57';
    }

    dispatch(createUser({
      nombre: formValues.nombre,
      usuario: formValues.usuario?.trim().toLowerCase(),
      telefono: `${phoneCodeNumber}${formValues.telefono}`,
      direccion: formValues.direccion,
      permisos: formValues.permisos
    }));

    fetchData();
  };

  // JSX  -----------------------------------------------------------------------------------------------------------
  const statusTemplate = (rowData: any) => {
    return rowData.Estado ? <span className='estado-entregado'>Activo</span> : <span className='estado-no-fullfilment'>Inactivo</span>;
  }
  const actionsTemplate = (rowData: any) => {
    return rowData.Usuario !== shopInfo.correo &&
      <div
        className='btn btn-danger btn-sm'
        onClick={() => deleteUser(rowData.id)}>
        Eliminar
      </div>
  }

  return (
    <>
      <div className='bodyTendyc'>
        <div className='containerFull'>
          <div className='backArrow bordeFlecha' onClick={() => navigate(-1)}>
            <img src={arrow}></img>
          </div>
          <div className="mainTitle">Agregar empleado</div>
          <div className='row'>
            <div className='col-md-12'>
              <div className='row'>
                <div className='col-12 mb-3'>
                  <div className='cardContainer'>
                    <form onSubmit={(e: any) => handleSubmit(e)}>

                      <div className='row'>
                        <div className='col-6 my-2'>
                          <div className='sectionTitle mb-2'>Nombre completo</div>
                          <input
                            type='text'
                            className='form-control'
                            value={formValues.nombre}
                            onChange={(e: any) => setFormValues({ ...formValues, nombre: e.target.value })}
                          />
                        </div>

                        <div className='col-6 my-2'>
                          <div className='sectionTitle mb-2'>Correo electrónico</div>
                          <input
                            type='email'
                            className='form-control'
                            value={formValues.usuario}
                            onChange={(e: any) => setFormValues({ ...formValues, usuario: e.target.value })}
                          />
                        </div>

                        <div className='col-6 my-2'>
                          <div className='sectionTitle'>Telefono</div>
                          <div className="phone-lib-container">
                            <PhoneLibReact
                              ref={phoneLibRef}
                              initialCountry={formValues.phoneCode}
                              layout="separated"
                              showDialCode={false}
                              countryLabel=""
                              phoneLabel=" "
                              onCountryChange={(country: string) => {
                                setFormValues({ ...formValues, phoneCode: country });
                              }}
                              onPhoneChange={(_phoneNumber: string, _isValid: boolean) => {
                                if (phoneLibRef.current) {
                                  const raw = phoneLibRef.current.getRaw();
                                  setFormValues({ ...formValues, telefono: raw });
                                }
                              }}
                            />
                          </div>
                        </div>

                        <div className='col-6 my-2'>
                          <div className='sectionTitle mb-2'>Dirección</div>
                          <input
                            type='text'
                            className='form-control'
                            value={formValues.direccion}
                            onChange={(e: any) => setFormValues({ ...formValues, direccion: e.target.value })}
                          />
                        </div>

                        <h4 className="mb-2 mt-2">Permisos</h4>

                        <div className='col-6 my-2'>
                          <div className="subCard mb-2 mt-2">General</div>

                          {/*<div className="form-check my-2">
                            <input className="form-check-input" type="checkbox" name="check_list[]" value="1" />
                            <label className="form-check-label">Home</label>
                          </div>*/}
                          <div className="form-check my-2">
                            <input className="form-check-input" type="checkbox" name="check_list[]" value="5" />
                            <label className="form-check-label">Catalogo</label>
                          </div>
                          {/*<div className="form-check my-2">
                            <input className="form-check-input" type="checkbox" name="check_list[]" value="3" />
                            <label className="form-check-label">Clientes</label>
                          </div>*/}
                          <div className="form-check my-2">
                            <input className="form-check-input" type="checkbox" name="check_list[]" value="2" />
                            <label className="form-check-label">Pedidos</label>
                          </div>
                          {/*<div className="form-check my-2">
                            <input className="form-check-input" type="checkbox" name="check_list[]" value="4" />
                            <label className="form-check-label">Analítica</label>
                          </div>*/}
                        </div>

                        <div className='col-6 my-2'>
                          <div className="subCard mb-2 mt-2">Administración</div>

                          <div className="form-check my-2">
                            <input className="form-check-input" type="checkbox" name="check_list[]" value="7" />
                            <label className="form-check-label">Usuarios y Permisos</label>
                          </div>
                          {/*<div className="form-check my-2">
                            <input className="form-check-input" type="checkbox" name="check_list[]" value="3" />
                            <label className="form-check-label">Clientes</label>
                          </div>*/}
                          {/*<div className="form-check my-2">
                            <input className="form-check-input" type="checkbox" />
                            <label className="form-check-label">Envios</label>
                          </div>*/}
                          {/*<div className="form-check my-2">
                            <input className="form-check-input" type="checkbox" />
                            <label className="form-check-label">Pagos</label>
                          </div>*/}
                          {/*<div className="form-check my-2">
                            <input className="form-check-input" type="checkbox" name="check_list[]" value="9" />
                            <label className="form-check-label">Tema</label>
                          </div>*/}
                        </div>

                      </div>

                      <div>
                        <button className='btn botonTendyc'>Guardar</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='bodyTendyc' style={{ marginTop: '0px' }}>
        <div className='containerFull'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='mainTitle'>Usuarios</div>
              <div className='cardContainer'>
                <div className="row">
                  <div className="col-12">
                    <SearchBar
                      placeholder="Buscar usuario"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      onSearch={() => { setPaginationData({ ...paginationData, searchValue: searchValue, currentPage: 1 }) }}
                    />
                  </div>
                </div>
                <div className='col-md-12 table-responsive mt-3'>
                  <Table data={paginated} loading={isLoading} onRowClick={(product) => navigate(`/producto/${product.id}`)} totalRecords={totalRecords}
                    onFilterChange={(filters: any) => { setPaginationData({ ...paginationData, currentPage: 1, filters, }) }}>
                    <Column field="Nombre" header="Nombre" width="20%" name='name' />
                    <Column field="Usuario" header="Correo electrónico" width="30%" name='email' />
                    <Column field="Permisos" header="Permisos" width="10%" name='permissions' />
                    <Column field="Telefono" header="Teléfono" width="10%" name='phone' />
                    <Column field="Direccion" header="Dirección" width="10%" name='address' />
                    <Column template={statusTemplate} header="Estado" width="10%" name='status' />
                    <Column template={actionsTemplate} header="Acciones" width="10%" />

                  </Table>
                  <Paginator totalRecords={totalRecords} onChange={(page, rows) => {
                    setPaginationData({
                      ...paginationData,
                      currentPage: page,
                      itemsPerPage: rows,
                    })
                  }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AjustesUsuariosScreen;