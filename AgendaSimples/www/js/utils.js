var db;
var dataset;

function IniciaBD() {
    try {
            var shortName = 'Agenda';
            var version = '1.0';
            var displayName = 'Agenda Simples';
            var maxSizeInBytes = 65536;
            db = openDatabase(shortName, version, displayName, maxSizeInBytes);
            CriaTabela();
    } catch(e) {
            alert('Erro ao iniciar Banco de Dados ' + e);
        }
        return;
}

function CriaTabela() {
    
    var sql = "CREATE TABLE IF NOT EXISTS Agenda (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, cpf TEXT, sexo TEXT, fone TEXT)";

    db.transaction(
        function (transaction) {
            transaction.executeSql(sql, [], ExibeRegistros, handleErrors);
        }
    );
    
}

function IncluiRegistro() {

    var nome = $('#nome').val();
	var cpf = $('#cpf').val();
    var sexo = $('#sexo').val();
	var fone = $('#fone').val();

    IncluiRegistroInterno(nome, cpf, sexo, fone);
}

function IncluiRegistroInterno(nome, cpf, sexo, fone) {

    var sql = 'INSERT INTO Agenda (nome, cpf, sexo, fone) VALUES (?, ?, ?, ?)';

    db.transaction(
        function (transaction) {
            transaction.executeSql(sql, [nome, cpf, sexo, fone], showRecordsAndResetForm, handleErrors);
        }
    );
}

function ExcluiRegistro(id) {
    var txt;

    
    if (confirm("Deseja realmente excluir o registro?")) {
        var sql = 'DELETE FROM Agenda WHERE id=?';
    
        db.transaction(
            function (transaction) {
                transaction.executeSql(sql, [id], ExibeRegistros, handleErrors);
                alert('Excluído com sucesso!');
            }
        );

        ResetaForm();

    }     
}

function AtualizaRegistro() {

	var nome = $('#nome').val();
	var cpf = $('#cpf').val();
    var sexo = $('#sexo').val();
	var fone = $('#fone').val();
    var id = $("#id").val();

    var sql = 'UPDATE Agenda SET nome=?, cpf=?, sexo=?, fone=? WHERE id=?';

    db.transaction(
        function (transaction) {
            transaction.executeSql(sql, [nome, cpf, sexo, fone, id], showRecordsAndResetForm, handleErrors);
        }
    );
}

function Reinicia() {

    var sql = 'DROP TABLE Agenda';

    db.transaction(
        function (transaction) {
            transaction.executeSql(sql, [], ExibeRegistros, handleErrors);
        }
    );
    
    IniciaBD();
    
    ResetaForm();
    
}

function LerRegistro(i) {

    var item = dataset.item(i);

    $('#nome').val(item['nome']);
    $('#cpf').val(item['cpf']);
    $('#sexo').val(item['sexo']);
    $('#fone').val(item['fone']);	
    $('#id').val(item['id']);
}

function ResetaForm() {

    $('#nome').val('');
    $('#cpf').val('');
    $('#sexo').val('');
    $('#fone').val('');
    $('#id').val('');
}

function showRecordsAndResetForm() {
    ResetaForm();
    ExibeRegistros();
}

function handleErrors(transaction, error) {
    alert(error.message);
    return true;
}

function ExibeRegistros() {

    var sql = "SELECT * FROM Agenda ORDER BY nome ASC";

    db.transaction(
        function (transaction) {
            transaction.executeSql(sql, [], FormataRegistrosTela, handleErrors);
        }
    );
}

function FormataRegistrosTela(transaction, results) {

    html = '';
    $('#results').html('');

    dataset = results.rows;
    
    if (dataset.length > 0) {
        //html = html + '<br/><br/>';
		
        html = html + '<table class="table table-bordered">';
        html = html + '  <tbody>';		

        for (var i = 0, item = null; i < dataset.length; i++) {
            item = dataset.item(i);

            html = html + '    <tr>';
            html = html + '      <td>' + item['nome'] + '</td>';
            html = html + '      <td>';
            html = html + '        <a class="btn btn-primary btn-mini" title="Mostrar Detalhes" href="#cadastrar" onClick="LerRegistro(' + i + ');"><b>M</td> <td></a>';
            html = html + '        <a class="btn btn-danger btn-mini"  title="Excluir este" href="#" onClick="ExcluiRegistro(' + item['id'] + ');"><b>E</a>';
            html = html + '      </td>';
            html = html + '    </tr>';
        }

        html = html + '  </tbody>';
        html = html + '</table>';

        $('#results').append(html);
    }
}


function updateCacheContent(event) {
    window.applicationCache.swapCache();
}

$(document).ready(function () {
    window.applicationCache.addEventListener('updateready', updateCacheContent, false);
    IniciaBD();
});
