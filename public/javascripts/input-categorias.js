document.addEventListener('DOMContentLoaded', () => {
     const input = document.getElementById('numero-categorias');
     const divNomeCategorias = document.getElementById('input-categorias-nomes');

     input.addEventListener('change', (event) => {

          var numeroDeInputs = event.target.value;

          var input_novo = ``;

          for (var i = 0; i < numeroDeInputs; i++) {

               input_novo += `<div class="row novas-categorias">
               <div class="col">
                    <label for="nomeCategoria[${i}]">${i + 1}ª CATEGORIA:</label>
                    <input type="text" class="form-control inputs-formularios inputs-informações-categorias"
                         name="nomeCategoria[${i}]" placeholder="Nome da categoria">
               </div>

               <div class="col">
                    <label for="numeroDeSenhasPorCategoria[${i}]">NUMERO DE
                         SENHAS:</label>
                    <input type="number" class="form-control inputs-formularios inputs-informações-categorias"
                         name="numeroDeSenhasPorCategoria[${i}]"
                         placeholder="Numero de senhas">
               </div>

               <div class="col">
                    <label for="precoPadraoPorcategoria[${i}]">PREÇO PADRÃO:</label>
                    <input type="number" class="form-control inputs-formularios inputs-informações-categorias"
                         name="precoPadraoPorcategoria[${i}]"
                         placeholder="Numero de senhas">
               </div>

               <div class="col">
                    <label for="numeroSenhasPessoa[${i}]">SENHAS POR PESSOA:</label>
                    <input type="number" class="form-control inputs-formularios inputs-informações-categorias"
                         name="numeroSenhasPessoa[${i}]" placeholder="Por pessoa">
               </div>
          </div>`

          }

          divNomeCategorias.innerHTML = input_novo;

     });

});
