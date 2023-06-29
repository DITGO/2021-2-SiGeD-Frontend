import { APIPatrimonio } from './baseService/index';

export async function getPatrimonio(url, startModal) {
  try {
    const response = await APIPatrimonio.get(url);
    return response;
  } catch (error) {
    if (error.response?.status === 500) {
      startModal('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error.response?.status !== 401) {
      startModal('Não foi possível obter a lista de patrimonio, tente novamente mais tarde.');
    }
    console.error(`An unexpected error ocourred while retrieving the Patrimonio list.${error}`);
  }
  return false;
}

export async function createPatrimonio(name, description, startModal) {
  try {
    const response = await APIPatrimonio.post('patrimony', {
      name,
      description,
    });
    if (response.data.status) {
      startModal('Preencha todos os campos para poder criar um novo patrimonio');
    }
  } catch (error) {
    if (error.response.status === 500) {
      startModal('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error.response.status !== 401) {
      startModal('Não foi possível criar a nova lotação, tente novamente mais tarde.');
    }
    console.error(`An unexpected error ocourred while creating a new workspace.${error}`);
  }
}

export const updatePatrimonio = async (name, description, id, startModal) => {
  try {
    const res = await APIPatrimonio.put(`patrimony/${id}`, {
      name,
      description,
    });
    if (res.data.status) {
      startModal('Preencha todos os campos para poder editar um Patrimonio');
    }
  } catch (error) {
    if (error.response.status === 500) {
      startModal('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error.response.status !== 401) {
      startModal(
        'Não foi possível atualizar a lotação, tente novamente mais tarde.',
      );
    }
    console.error(
      `An unexpected error ocourred while updating an already created workspace.${error}`,
    );
  }
};

export const deletePatrimonio = async (id, startModal) => {
  try {
    const res = await APIPatrimonio.delete(`/patrimony/${id}`);
    return res;
  } catch (error) {
    if (error.response.status === 500) {
      startModal('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error.response.status !== 401) {
      startModal(`Não foi possivel deletar a lotação.\n${error}`);
    }
    console.error(error);
  }
  return false;
};
