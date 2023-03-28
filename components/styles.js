import styled, {keyframes, css} from 'styled-components';

export const Container = styled.ul`
  max-width: 900px;
  /* background: #FFF; */
  background-color:#0D2636;
  display: table-row;
  display: flex;
  justify-content:center;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  padding: 10px;
  margin: 40px auto;
  color: #000;

  img{
  /* width: 150px; */
  border-radius: 10%;
  margin: 20px 0;
  max-width: 300px;
  margin-right: 20px;
}

  h1 {
    color: #FFF;
    align-items:center;
    justify-content:center;
  }

`;



export const TweetList = styled.ul`
  margin: 40px auto;

  background-color:#0D2636;
  margin-top: 10px;
  padding: 10px;
  border-top: 1px solid #eee;
  list-style:none;
  max-width: 900px;
  /* align-items: center; */
  /* justify-content: center; */
  border-radius: 8px;
  
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);

  li{
    display:flex;
    padding: 15px 10px;

    & + li{
      border-top: 1px solid #eee;
      /* padding: 15px 10px; */

      margin-top: 12px;
    }


    div{
      flex:1;
      margin-left: 12px;
      margin-right: 12px;


      p{
        margin-top: 10px;
        font-size: 12px;
        color: #ccc;
        align-items:center;
        max-width: 400px;
      }


    strong{
      font-size: 15px;

      a{
        text-decoration:none;
        color: #FFF;
        transform: 0.3s;

        &:hover{
          color: #0071db;
        }

      }

      span{
        background: #CCFFCC;
        color: #000;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
        padding: 5px 7px;
        margin-left: 10px;
      }

    }
  }
}
`;

export const Form = styled.form`
  margin-top: 30px;
  display:flex;
  flex-direction: row;

  input{
    flex:1;
    border: 1px solid ${props => (props.error ? '#FF0000' : '#eee')};
    padding: 10px 15px;
    border-radius: 4px;
    font-size: 17px;
    margin-left: 10px;
    max-width: 100px;


  }


`;

//Criando animcação do botao
const animate = keyframes`
  from{
    transform: rotate(0deg);
  }

  to{
    transform: rotate(360deg);
  }
`;

export const SubmitButton = styled.button.attrs(props => ({
  type: 'submit',
  disabled: props.loading,
}))`
  background:#0D2636;
  border: 0;
  border-radius: 4px;
  margin-left: 10px;
  padding: 0 15px;
  display: flex;
  justify-content: center;
  align-items: center;


  &[disabled]{
    cursor: not-allowed;
    opacity: 0.5;
  }


  ${props => props.loading &&
    css`
      svg{
        animation: ${animate} 2s linear infinite;
      }
    `
  }


`

// export const PageActions = styled.div`
//   display:flex;
//   align-items:center;
//   justify-content: space-between;

//   button{
//     outline:0;
//     border:0;
//     background: grey;
//     color: #0D2636;
//     padding: 5px 10px;
//     border-radius: 4px;
//     text-decoration:none;
//     transform: 0.3s;

//     &:disabled{
//       cursor: not-allowed;
//       opacity: 0.5;
//     }

//     &:hover{
//       /* color: #0D2636; */
//       cursor: pointer;
//     }

//   }

// `

export const FilterList = styled.div`
  margin: 15px 0;

  button{
    outline:0;
    border:0;
    padding: 8px;
    border-radius: 6px;
    margin: 0 3px;

    &:nth-child(${props => props.active + 1}){
      background: #0071db;
      color:#FFF;
    }


  }

`
;