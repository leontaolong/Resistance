# Architected Resistance

This repo contains code for two different versions of an application to manage political resistance actions. Each version utilizes an architectural style:

1. Three-Tier Architecture
2. Event-Based or Flux Architecture

See the individual folders for more details.

### Architectural Analysis

Both architectural styles are efficient for this application. Since both architectural styles are similar to MVC property, which means that each layer or component is handing specific aspect of the program (follows Principle of Separation of Concerns). Thus, both styles are pretty organized and easier to design, debug or make changes. 
Three-Tier Architecture
Benefits:
Performance: Because managing data is independent from the storage.
Flexibility: As each tier is independent it is possible to use different sets of developers.
Security: Since the client doesn’t have direct access to the database business logic is more secure
Drawback:
It is a relatively complex structure and has difficulties to set up and maintain it as well. And also, since three tier components are closely correlated, a small glitch in each one tier may affect the performance of other two.
Flux Architecture
Benefits:
Convenience: since the flux already built up the dispatch component and provides easy-to-follow format. Thus it's continent for us to get started.
Readability/organization: Because it's following separation of concerns, you can separate view (in components) from logic (in store). Thus, We have spent less time debugging.
Operability：since this architecture is able to passing enables things like Event Sourcing. So we can operate different commands by using different action and getting event.
Drawback:
It is also a complex architecture to implement. It's not logically challenging, but lots of work to do, like
building up the UI. And also there is no way to store the data once the application is closed due to the lack of a data store. Flux architecture is also quite complicated and goes through a lot of steps to produce a solution. The Resistance program is small and simple, proving that Flux can easily over complicate various tasks.


Three-Tier Architecture：
Three-Tier Architecture is a perfect fit for persist the data entered into the manager. Since the lower data layer is supposed to store and maintain the data permanently, which means user will not lose data even if they close the application and reopen. When user inputs the data in the presentation layer, presentation layer will pass the data into logic layer (business layer). The business layer will make logic decision and calculation, then convey those data into the internal database which is data layer. Data layer will store those raw data correspondingly, move back to the logic layer for processing and eventually be presented in front of the user. In this application, the database.json is our data layer. it will write the data into json Object once logic layer assigns the data to it. When the presentation layer asks the logic layer for data, then the data stored in database.json will be convert back to string type and render to the user.

Flux:
Since the we have to deal with dynamic data, Flux is very efficient to support multiple views. Each protester, protests, and movements have their own Action, Store, and View modules to handle the different data entered by the user for the different functionality of the resistance. Since the flux follows unidirectional data flow that allows data to be transmitted in real time, and to be and modified or view all in one time. Flux architecture is a very efficient way to view data since it quickly decides what to do with the data by selecting specific action, and display it accordingly. Thus this decision made by the Dispatcher travel different Stores, then sent the corresponding content to the specific View/Views. Views are controller-views, also very common in most GUI MVC patterns. They listen for changes from the stores and re-render themselves appropriately. If Views has another command inputted by user, it just add new actions to the dispatcher and do the same process. So flux is very efficient for supporting multiple simultaneous "views" and interactions with the data.
