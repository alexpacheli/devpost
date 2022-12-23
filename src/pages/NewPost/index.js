import React, {useState, useLayoutEffect, useContext} from "react";
import firestore from "@react-native-firebase/firestore";
import storage from '@react-native-firebase/storage';

import { AuthContext } from "../../contexts/auth";

import { Container, Input, Button, ButtonText } from "./style";

function NewPost({navigation}) {
    const [post, setPost] = useState("");
    const {user} = useContext(AuthContext);

    useLayoutEffect(() => {
        const options = navigation.setOptions({
            headerRight: () => (
                <Button onPress={handlePost}>
                    <ButtonText>Compartilhar</ButtonText>
                </Button>
            )
        })
    }, [navigation, post])

    async function handlePost() {
        if (post === '') {
            alert('Favor digitar o conteúdo do post.')
            return;
        }

        let avatarUrl = null;

        try {
            let response = await storage().ref('users').child(user?.uid).getDownloadURL();
            avatarUrl(response);

        } catch (error) {
            avatarUrl = null;
        }

        await firestore().collection('posts')
        .add({
            created: new Date(),
            content: post,
            autor: user?.nome,
            userId: user?.uid,
            likes: 0,
            avatarUrl,
        })
        .then(() => {
            setPost('');
            navigation.goBack();
        })
        .catch((error) => {
            alert(error.message);
        }) 
    }

    return (
        <Container>
            <Input
                placeholder="O que está acontecendo?"
                placeholderTextColor="#DDD"
                value={post}
                onChangeText={(text) => setPost(text)}
                autoCorrect={false}
                multiline={true}
                maxlength={300}
            />
        </Container>
    )
}

export default NewPost;