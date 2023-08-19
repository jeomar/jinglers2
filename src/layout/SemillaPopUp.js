import { Fragment, useState, useRef } from "react";
import { connect } from "react-redux";
import { semillaToggle } from "../redux/actions/siteSettings";
import { Keypair, LAMPORTS_PER_SOL, Connection } from "@solana/web3.js";

const Bip39 = require('bip39');

const SemillaPopUp = ({ semillaToggle, semilla }) => {
  
  const [frase, setFrase] = useState('');
  const [btnGenVisible, setbtnGenVisible] = useState(true);
  const [frmVisible, setfrmVisible] = useState(false);
  const inputRef = useRef(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    clavePrivada: '',
    clavePublica: '',
    password: ''
  });


  const handleClick = () => {
    let _frase = Bip39.generateMnemonic();
    setFrase(_frase);
    navigator.clipboard.writeText(_frase);
    setbtnGenVisible(false);
    setfrmVisible(true);
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(frase);
    alert('Texto copiado al portapapeles');
  };


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validarUsuario = (e) => { 
   
    fetch('http://localhost:9000/api/users/' + formData.id, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'

      },
    })
      .then((res) => res.json())
      .then(data => {
        console.log(data);
        console.log('Id: ' + formData.id);
        if (data && data['id'] == formData.id) {
          e.target.value = '';
          alert('Usuario: ' + data['id'] + ' ya existe');
          formData.name = '';
          formData.id = '';
          inputRef.current.focus();
        }
      })
      .catch(error => console.log(error));
    console.log('datos:');
    console.log(formData);

    // Aquí puedes agregar el código que deseas ejecutar cuando se haga clic en el botón
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    const endpoint = 'https://newest-frequent-haze.solana-devnet.discover.quiknode.pro/8c8d6440dc7f8aa806ebc52cf4af07d351b7968c/'; //Replace with your RPC Endpoint
    const solanaConnection = new Connection(endpoint);

    const seed = Bip39.mnemonicToSeedSync(frase, ""); // (mnemonic, password)
    const keypair = Keypair.fromSeed(seed.slice(0, 32));
    console.log(`Generated new KeyPair. Wallet PublicKey: seed `, `${keypair.publicKey.toBase58()}`);

    //STEP 2 - Generate a New Solana Wallet
    //const keypair = Keypair.generate();
    console.log(keypair);

    console.log(`Generated new KeyPair. Wallet PublicKey: `, keypair.publicKey.toString());
    //STEP 3 - Write Wallet Secret Key to a .JSON
    const secret_array = keypair.secretKey
      .toString() //convert secret key to string
      .split(',') //delimit string by commas and convert to an array of strings
      .map(value => Number(value)); //convert string values to numbers inside the array

    const secret = JSON.stringify(secret_array); //Covert to JSON string
    console.log(secret);


    formData.clavePublica = keypair.publicKey.toString();
    //formData.clavePrivada = secret;
    formData.clavePrivada ='';
    fetch('http://localhost:9000/api/users', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'

      },
    })
      .then((res) => res.json())
      .then(data => console.log(data))
      .catch(error => console.log(error));

    console.log(formData);
  };

  const textareaStyles = {
    height: '30%',
    backgroundColor: 'white',
    color: 'black',
    // Agrega otros estilos personalizados si es necesario
  };

  return (
    <Fragment>
      <div
        className={`metaportal_fn_wallet_closer ${semilla ? "active" : ""}`}
        onClick={() => semillaToggle(false)}
      />
      <div className={`metaportal_fn_walletbox ${semilla ? "active" : ""}`}>
        <a href="#" className="fn__closer" onClick={() => semillaToggle(false)}>
          <span />
        </a>
        <div className="walletbox">
          <div className="title_holder">
            <p><strong>Copia las siguientes palabras para que en un futuro recuperes tu cuenta</strong></p>

            <div >
              {frase && (
                <p>
                  <textarea value={frase} readOnly style={textareaStyles} />
                  <button onClick={handleCopyClick}>Copiar</button>
                </p>)
              }
            </div>

          </div>
          <div>
            <div className="list_holder">
              <div>
                {btnGenVisible && (
                  <ul className="metaportal_fn_items">

                    <li>
                      <div className="item">
                        <a href="#"
                          onClick={() => handleClick()}
                        >
                        </a>

                        <span className="text">Generar</span>

                      </div>
                    </li>

                  </ul>
                )}
              </div>
            </div>
            <div>
              {frmVisible && (
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-3">
                      <label>
                        Id
                      </label>
                    </div>

                  </div>

                  <div className="row">

                    <div className="col-md-3">

                      <input
                        type="text"
                        name="id"
                        ref={inputRef}
                        className="form-control"
                        value={formData.id}
                        onBlur={validarUsuario}
                        onChange={handleChange}
                      />

                    </div>
                  </div>



                  <div className="row">
                    <div className="col-md-3">
                      <label>
                        Nombre
                      </label>
                    </div>

                  </div>


                  <div className="row">

                    <div className="col-md-3">

                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleChange}

                      />

                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-3">
                      <label>
                        Email
                      </label>
                    </div>

                  </div>


                  <div className="row">

                    <div className="col-md-3">

                      <input
                        type="text"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}

                      />

                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-3">
                      <label>
                        Password
                      </label>
                    </div>

                  </div>


                  <div className="row">

                    <div className="col-md-3">

                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        value={formData.password}
                        onChange={handleChange}

                      />

                    </div>

                  </div>

                  <div className="row">

                    <div className="col-md-1">
                      <button className="btn btn-primary" type="submit">Registrar</button>
                    </div>

                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  semilla: state.site.semilla,
});

export default connect(mapStateToProps, { semillaToggle })(SemillaPopUp);
