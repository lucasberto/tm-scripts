// ==UserScript==
// @name         Transferência em lote
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  adicionar itens automaticamente na transferencia em lotes!
// @author       Lucas Berto
// @match        https://www.bling.com.br/b/produtos.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bling.com.br
// @updateURL    https://raw.githubusercontent.com/lucasberto/tm-scripts/main/bling/transferenciaEmLote.js
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const btn_mini_search = $("#btn-mini-search");
  let produtos = [];
  let lock = false;

  const selecionaProduto = (codigo_produto) => {
    const results = $(".tabela-listagem tbody tr");
    if (results.length <= 1) {
      if (results.length == 1) {
        const check = $(".tcheck");
        check.click();
        datatable.selecteds.add(check.val());
      }
      lock = false;
    } else {
      lock = true;
      setTimeout((_) => selecionaProduto(codigo_produto), 1000);
    }
  };

  const pesquisaProduto = (codigo_produto) => {
    lock = true;
    $("#pesquisa-mini").val(codigo_produto);
    pesquisarMini();
    setTimeout((_) => selecionaProduto(codigo_produto), 1000);
  };

  const processaProximoProduto = () => {
    if (!lock) {
      if (produtos.length > 0) {
        const prod = produtos.pop();
        pesquisaProduto(prod);

        setTimeout(processaProximoProduto, 1000);
      } else {
        setTimeout(iniciarTransLote, 2000);
      }
    } else {
      setTimeout(processaProximoProduto, 1000);
    }
  };

  const handleClick = () => {
    const data = $("#pesquisa-mini").val().split(" ");
    const ok = confirm(data.length + " produtos encontrados. Prosseguir?");
    if (ok) {
      produtos = data;
      processaProximoProduto();
    }
  };

  //Criação do botão
  const search_bar = $(".search-bar");

  search_bar.after(
    '<button type="button" id="btn_transferencia_em_lote" class="bling-button call-to-action" style="display:inline-block; width:auto;">Transferência em lote</button>'
  );
  $("#btn_transferencia_em_lote").click(handleClick);
})();
