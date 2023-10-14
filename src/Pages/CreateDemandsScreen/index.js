/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import moment from 'moment';
import { Main, Footer } from './Style';
import SectorDropdown from '../../Components/SectorDropdown';
import CategoryDiv from '../../Components/AddCategoryComponent';
import RightBoxComponent from '../../Components/RightBoxComponent';
import { createDemand } from '../../Services/Axios/demandsServices';
import DemandsDescription from '../../Components/DemandsDescription';
import SelectedCategories from '../../Components/SelectedCategories';
import ClientDropdown from '../../Components/ClientDropdown';
import { getClients } from '../../Services/Axios/clientServices';
import TinyButton from '../../Components/TinyButton';
import ConfirmDemandModal from '../../Components/ConfirmDemandModal';
import { useProfileUser } from '../../Context';
import removeCategory from '../../Utils/functions';
import UserDropdown from "../../Components/UserDropdown";

const CreateDemandsScreen = () => {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [process, setProcess] = useState(['', '', '', '', '']);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [clients, setClients] = useState([]);
  const [sectorID, setSectorID] = useState('');
  const [categoriesIDs, setCategoriesIDs] = useState([]);
  const [clientID, setClientID] = useState('');
  const [username, setUsername] = useState('');

  const [clientName, setClientName] = useState('');
  const [demandDate, setDemandDate] = useState(moment().format('YYYY-MM-DD'));
  const { user, startModal } = useProfileUser();
  const history = useHistory();

  const getClientsFromApi = async () => {
    await getClients('clients', startModal)
      .then((response) => setClients(response.data));
  };

  useEffect(() => { getClientsFromApi() }, []);

  useEffect(() => {
    const IDs = selectedCategories?.map((selectedCategory) => selectedCategory._id);
    setCategoriesIDs(IDs);
  }, [selectedCategories]);

  const deleteCategory = (searchCategory) => {
    setSelectedCategories(removeCategory(searchCategory, selectedCategories));
  };

  const pushCategory = (category) => {
    let alreadySelected = false;
    selectedCategories.forEach((passCategory) => {
      if (category._id === passCategory._id) {
        alreadySelected = true;
      }
    });
    if (!alreadySelected) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      startModal('A categoria escolhida ja foi selecionada');
    }
  };

  const validateInputs = () => {
    return !(!name || !description || !sectorID || !clientID || categoriesIDs === undefined);
  };

  const submit = async () => {
    const responsibleUserName = username;
    if (validateInputs()) {
      startModal('Demanda criada com sucesso!');
      const data = await createDemand(
        name,
        description,
        process.filter((p) => p !== ''),
        categoriesIDs,
        sectorID,
        user._id,
        responsibleUserName,
        clientID,
        startModal,
        demandDate,
      ).then((response) => response.data);
      if (data) {
        return history.push(`/visualizar/${data._id}`);
      }
    }
    startModal('Preencha todos os campos antes de cadastrar uma nova demanda.');
    return undefined;
  };

  const cancel = () => {
    history.push('/demandas');
  };

  if (!localStorage.getItem('@App:token')) {
    return <Redirect to="/login" />;
  }

  return (
    <Main>
      <DemandsDescription
        name={name}
        setName={setName}
        process={process}
        setProcess={setProcess}
        description={description}
        setDescription={setDescription}
        demandDate={demandDate}
        setDemandDate={setDemandDate}
        cancel={cancel}
        submit={handleShow}
        buttomName="Cadastrar" />
      <RightBoxComponent
        clientID={clientID}
        clientName={clientName} >
        <ClientDropdown
          clients={clients}
          setClientID={setClientID}
          setClientName={setClientName} />
        <SectorDropdown
          externalStyles={{ height: 'unset' }}
          setSector={setSectorID}
          sector={sectorID} />
        <UserDropdown
          placeholder="Responsável setor (opcional)"
          label="Responsável"
          externalFilters={{ sector: sectorID, open: 'any' }}
          setUsername={setUsername}
          waitForFilter />
        <CategoryDiv
          pushCategory={pushCategory} />
        <SelectedCategories
          selectedCategories={selectedCategories}
          removeCategory={deleteCategory} />
      </RightBoxComponent>
      <Footer>
        <TinyButton type="secondary" title="Cancelar" click={cancel} />
        <TinyButton type="primary" title="Cadastrar" click={handleShow} />
      </Footer>
      <ConfirmDemandModal
        show={show}
        handleClose={handleClose}
        submit={submit}
        actionName="Você tem certeza que gostaria de criar essa demanda?"
      />
    </Main>
  );
};

export default CreateDemandsScreen;
