import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import GenericListScreen from '../../Components/GenericListScreen';
import DataList from '../../Components/DataList';
import ModalComp from '../../Components/ModalComp';
import {
  TableHeader, TableTitle, P, Bar,
} from './Style';
import {
  getPatrimonio, createPatrimonio, updatePatrimonio, deletePatrimonio,
} from '../../Services/Axios/patrimonyServices';
import { useProfileUser } from '../../Context';

const PatrimonyScreen = () => {
  const { token, startModal } = useProfileUser();
  const [word, setWord] = useState();
  const [filterPatrimonios, setFilterPatrimonios] = useState([]);
  const [patrimonios, setPatrimonios] = useState([]);
  const [statusModal, setStatusModal] = useState(false);

  const toggleModal = () => setStatusModal(!statusModal);

  const getPatrimoniosFromApi = async () => {
    await getPatrimonio('patrimony', startModal)
      .then((response) => setPatrimonios(response.data))
      .catch((error) => {
        console.error(`An unexpected error ocourred while getting categories.${error}`);
      });
  };

  useEffect(() => {
    getPatrimoniosFromApi();
    console.log('patrimony screen');
  }, [token]);

  useEffect(() => {
    setFilterPatrimonios(patrimonios);
  }, [patrimonios]);

  useEffect(() => {
    setFilterPatrimonios(
      patrimonios.filter((patri) => patri.name.toLowerCase().includes(word?.toLowerCase())),
    );
  }, [word]);

  const listPatrimonios = () => {
    if (patrimonios.length === 0 || filterPatrimonios.length === 0) {
      return <h1>Sem resultados</h1>;
    }
    return filterPatrimonios.map((patrimonio) => (
      <DataList
        key={patrimonio.id}
        content={patrimonio}
        getContent={getPatrimoniosFromApi}
        color="black"
        axiosDelete={deletePatrimonio}
        updateContent={updatePatrimonio}
        type="Patrimônios"
      />
    ));
  };

  if (!localStorage.getItem('@App:token')) {
    return <Redirect to="/login" />;
  }

  return (
    <GenericListScreen
      ButtonTitle="Novo Patrimônio"
      ButtonFunction={toggleModal}
      PageTitle="Patrimônios"
      SearchWord={word}
      setWord={setWord}
      ListType={listPatrimonios()}
      redirectTo="/patrimonio"
    >
      <TableHeader>
        <TableTitle width={24}>
          <P>Nome</P>
        </TableTitle>
        <Bar />
        <TableTitle width={50}>
          <P>Descrição</P>
        </TableTitle>
        <Bar />
        <TableTitle width={24}>
          <P>Ult. Atualização</P>
        </TableTitle>
        <TableTitle width={2} />
      </TableHeader>
      { statusModal ? <ModalComp show={statusModal} type="Patrimônios" operation="Nova " idName="" idDescription="" idColor="#000000" getContent={getPatrimoniosFromApi} handleClose={toggleModal} createContent={createPatrimonio} /> : null }
    </GenericListScreen>
  );
};

export default PatrimonyScreen;
