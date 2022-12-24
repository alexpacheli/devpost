import React, { useContext, useState } from "react";
import Header from '../../components/Header';
import { AuthContext } from "../../contexts/auth";
import { Modal, Platform } from 'react-native';
import { 
    Container, 
    Name, 
    Email, 
    Button, 
    ButtonText, 
    UploadButton, 
    UploadText, 
    Avatar,
    ModalContainer,
    ButtonBack,
    Input 
} from "./styles";
import Feather from 'react-native-vector-icons/Feather';
import firestore from "@react-native-firebase/firestore";

function Profile() {
    const { signOut, user, setUser, storageUser } = useContext(AuthContext);
    const [nome, setNome] = useState(user?.nome);
    const [url, setUrl] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(null);

    async function handleSignOut() {
        await signOut();
    }

    async function updateProfile() {
        if (nome === '' || nome === user?.nome) {
            return;
        }

        setLoading('Atualizando...')

        await firestore().collection('users')
        .doc(user?.uid)
        .update({
            nome: nome
        })

        const postDocs = await firestore().collection('posts')
        .where('userId', '==', user?.uid)
        .get();

        postDocs.forEach(async doc => {
            await firestore().collection('posts').doc(doc.id)
            .update({
                autor: nome
            })
        })

        let data = {
            uid: user.uid,
            nome: nome,
            email: user.email
        }

        setUser(data);
        storageUser(data);
        setOpen(false);
        setLoading(null);

    }

    return (
        <Container>
            <Header />
            {url ? (
                <UploadButton onPress={() => setOpen(true)}>
                    <UploadText>+</UploadText>
                    <Avatar
                        source={{ uri: url }}
                    />
                </UploadButton>
            ) : (
                <UploadButton onPress={() => setOpen(true)}>
                    <UploadText>+</UploadText>
                    <Avatar
                        source={require('../../assets/avatar.png')}
                    />
                </UploadButton>
            )}
            <Name>{user?.nome}</Name>
            <Email>{user?.email}</Email>
            <Button bg="#428CFD" onPress={() => setOpen(true)}>
                <ButtonText color="#FFF">Atualizar Perfil</ButtonText>
            </Button>
            <Button bg="#DDD" onPress={handleSignOut}>
                <ButtonText color="#353840">Sair</ButtonText>
            </Button>

            <Modal visible={open} animationType="slide" transparent={true}>
                <ModalContainer behavior={Platform.OS === 'android' ? '' : 'padding'}>
                    <ButtonBack onPress={() => setOpen(false)}>
                        <Feather 
                            name="arrow-left"
                            size={22}
                            color="#121212"
                        />
                        <ButtonText color="#121212">Voltar</ButtonText>
                    </ButtonBack>
                    <Input 
                        placeholder={user?.nome}
                        value={nome}
                        onChangeText={(text) => setNome(text)}
                    />
                    <Button bg="#428CFD" onPress={updateProfile}>
                        {loading ? (
                            <ButtonText color="#FFF">{loading}</ButtonText>
                        ) : (
                            <ButtonText color="#FFF">Salvar</ButtonText>
                        )}
                        
                    </Button>
                </ModalContainer>

            </Modal>
        </Container>
    )
}

export default Profile;