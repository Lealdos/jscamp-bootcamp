# Aquí puedes dejar tus dudas

## Primera parte

<!-- Dudas de la primera parte del ejercicio -->

## Segunda parte

<!-- Dudas de la segunda parte del ejercicio -->

## Tercera parte

<!-- Dudas de la tercera parte del ejercicio -->

## Cuarta parte

<!-- Dudas de la cuarta parte del ejercicio -->

## Quinta parte

<!-- Dudas de la quinta parte del ejercicio -->

## Sexta parte

<!-- Dudas de la sexta parte del ejercicio -->

## Séptima parte

<!-- Dudas de la séptima parte del ejercicio -->

## Ejercicio extra

Por lo momentos no se me ocurrió ninguna duda. quizás son las correcciones eso cambie quedo a la espera gracias.

Buenas gracias por la corrección, tengo solo 2 dudas.

1- cuando en la pagina/componente search sacas las funciones para y explicas que es para mayor legibilidad. ¿Mi duda es si solo fue por legibilidad o también eso afectaría al rendimiento ya que se están tomando elementos fuera del virtual DOM de react? al leer eso me hizo pensar su fue solo eso u también había otra cosa.

const createAndSetParamIfExist = () => {
const params = new URLSearchParams(window.location.search);

    const setParam = (key, value) => {
        if (value) params.set(key, value);
        else params.delete(key);
    };

    return {
        params,
        setParam
    }

}
^
este pedazo de cogido que agregaste no lo entendi muy bien use IA para que me explicara pero quede bastante igual aunque entiendo lo que hace no entiendo como funciona al ser aplicado. para setear los parametros

2 - en la correction del componente
SearchFormSection.jsx no es siempre recomendable tener un id y un name para control
