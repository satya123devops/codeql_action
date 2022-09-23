import { getInput } from '@actions/core';

const getInputs = async (): Promise<any> => {
  const githubToken = getInput('githubToken', { required: true });

  return {
    githubToken
  };
};

export default getInputs;
