# nosql_template


## Предварительная проверка заданий

<a href=" ./../../../actions/workflows/1_helloworld.yml" >![1. Установка и настройка выбранной БД + ЯП]( ./../../actions/workflows/1_helloworld.yml/badge.svg)</a>

<a href=" ./../../../actions/workflows/2_usecase.yml" >![2. Usecase]( ./../../actions/workflows/2_usecase.yml/badge.svg)</a>

<a href=" ./../../../actions/workflows/3_data_model.yml" >![3. Модель данных]( ./../../actions/workflows/3_data_model.yml/badge.svg)</a>

<a href=" ./../../../actions/workflows/4_prototype_store_and_view.yml" >![4. Прототип хранение и представление]( ./../../actions/workflows/4_prototype_store_and_view.yml/badge.svg)</a>

<a href=" ./../../../actions/workflows/5_prototype_analysis.yml" >![5. Прототип анализ]( ./../../actions/workflows/5_prototype_analysis.yml/badge.svg)</a> 

<a href=" ./../../../actions/workflows/6_report.yml" >![6. Пояснительная записка]( ./../../actions/workflows/6_report.yml/badge.svg)</a>

<a href=" ./../../../actions/workflows/7_app_is_ready.yml" >![7. App is ready]( ./../../actions/workflows/7_app_is_ready.yml/badge.svg)</a>

## Список логинов и пароль для пользователей по умольчанию
| Роль      | Логин     | Пароль |
|-----------|-----------|--------|
| Рабочий   | Dmitry    | 1234   |
| Рабочий   | Roman     | 2345   |
| Рабочий   | Christian | 3456   |
| Прораб    | Mark      | 4567   |
| Кладовщик | Daria     | 6789   |

## Как запускать приложение
* В папке запускайте команду ```docker compose up --build```.
* Далее собираутся необходимые контейнеры для приложения.
* При первом запуске приложения, база данных будет пустая, т.е. материалов, накладных и статистики не будет. Нужно будет импортировать экспериментальные данные из папки ./backup через приложения в разделе « Import / Export ».
* Нужно закже отмечать что не все пользователей могут зайти во все разделы приложения. Только прорабы имеют польные права в приложении.
