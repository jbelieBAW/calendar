import React, { Component } from 'react';
import {Calendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment';
//import 'moment/locale/fr';

import $, { event } from 'jquery';
import {Overlay} from 'react-bootstrap';
import {OverlayTrigger} from 'react-bootstrap';
import {Popover} from 'react-bootstrap';

import "./App.css";

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const localizer = momentLocalizer(moment) // or globalizeLocalizer

const defaultMessages_fr={
  date: 'Date',
  time: 'Heure',
  event: 'Evènement',
  allDay: 'Toute la journée',
  week: 'Semaine',
  work_week: 'Semaine de travail',
  day: 'Jour',
  month: 'Mois',
  previous: 'Précédent',
  next: 'Suivant',
  yesterday: 'Hier',
  tomorrow: 'Demain',
  today: "Aujourd'hui",
  agenda: 'Agenda',
  noEventsInRange: "Il n'y a pas d'évènements dans cette période.",
  deleteButton: "SUPPRIMER",
  showMore: function showMore(total) {
    return "+" + total + " de plus";
  }
};

const defaultMessages_en={
  date: 'Date',
  time: 'Time',
  event: 'Event',
  allDay: 'All Day',
  week: 'Week',
  work_week: 'Work Week',
  day: 'Day',
  month: 'Month',
  previous: 'Back',
  next: 'Next',
  yesterday: 'Yesterday',
  tomorrow: 'Tomorrow',
  today: 'Today',
  agenda: 'Agenda',
  noEventsInRange: 'There are no events in this range.',
  deleteButton: "DELETE",
  showMore: function showMore(total) {
    return "+" + total + " more";
  }
};

function Event({ event }) {
  function deleteEventClick(id) {
    console.log($('span[name="react-control-customData"]'));
    console.log($('a[name="react-control-deleteEvent-button"]'));
    $('span[name="react-control-customData"]').text(id);
    document.getElementsByName("react-control-deleteEvent-button")[0].click();
  };

  let popoverClickRootClose = (
    <Popover id="popover-trigger-click-root-close">
      <Popover.Header as="h3">{event.title}</Popover.Header>
      <Popover.Body>
        <span>{event.country}</span><br/>
        <span>{event.bu}</span><br/>
        <span>{event.entity}</span><br/>
        <span>{event.site}</span><br/>
        <span>{event.safe}</span><br/>
        <button onClick={() => deleteEventClick(event.id)}>{event.deleteButtonText}</button>
      </Popover.Body>
    </Popover>
  );

  return (
    <OverlayTrigger id="help" trigger="click" rootClose container={this} placement="top" overlay={popoverClickRootClose}>
      <div><span class="eventTitle">{event.title}</span><br/>{event.desc}</div>
    </OverlayTrigger>
  );
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {defaultCulture: '', defaultMessages: {}, defaultDeleteButtonText:'', events: []};
  };

  refreshEvents() {
    var eventsArray = [];
    var currentDeleteButtonText = '';
    var currentCulture = '';
    if ($('[name="com.dcr.datalabel.lang"]').html()=='FR'){
    //if (/^fr\b/.test(navigator.language)) {
      currentDeleteButtonText = 'SUPPRIMER';
      var currentCulture = 'fr';
    }else{
      currentDeleteButtonText = 'DELETE';
      var currentCulture = 'en';
    }

    $('div[name="CalendarDataTable"] .grid-body .grid-body-content tr').not('.empty-grid').each(function(){
      var $this = $(this);
      this.event = new Object;
      var my_self = this;
      $this.children("td").each(function( idx ) {
        my_self.event.allDay=true;
        my_self.event.deleteButtonText=currentDeleteButtonText;
        switch(idx){
          //ID
          case 0:
            my_self.event.id=$(this).data("options").value;
            break;
          //COUNTRY
          case 1:
            my_self.event.country=$(this).data("options").value;
            break;
          //BU
          case 2:
            my_self.event.bu=$(this).data("options").value;
            break;
          //ENTITY
          case 3:
            my_self.event.entity=$(this).data("options").value;
            break;
          //SITE
          case 4:
            my_self.event.site=$(this).data("options").value;
            break;
          //SAFE
          case 5:
            my_self.event.safe=$(this).data("options").value;
            break;  
          //START DATE
          case 6:
            my_self.event.start=$(this).data("options").value;
            break;
          //END DATE
          case 7:
            my_self.event.end=$(this).data("options").value;
            break;
          //TASK NAME FR
          case 8:
            if (currentCulture=='fr') {
              my_self.event.title=$(this).data("options").value;
            }
            break;
          //TASK NAME EN
          case 9:
            if (currentCulture=='en') {
              my_self.event.title=$(this).data("options").value;
            }
            break;  
          //TASK TYPE INSTANCE
          case 10:
            break;
          //TASK TYPE ID
          case 11:
            break;
          // TASK COLOR
          case 12:
            my_self.event.color=$(this).data("options").value;
            break;
          default:
            console.log("Unbound value");    
        }
        my_self.event.desc= my_self.event.country ;
		if ( my_self.event.bu ) {
			my_self.event.desc+=" / " + my_self.event.bu;
			if ( my_self.event.entity ) {
				my_self.event.desc+=" / " + my_self.event.entity;
				if ( my_self.event.site ) {
					my_self.event.desc+=" / " + my_self.event.site;
				}				
			}
		}
		
        if(my_self.event.safe != ""){
          my_self.event.desc = my_self.event.desc + " / " + my_self.event.safe;
        }
      });
      eventsArray.push(this.event);
    });
    if (eventsArray.length===0){
      eventsArray = [...this.state.events];
      eventsArray.splice(0,eventsArray.length); 
    }
    this.setState({events : eventsArray});
  };

  componentDidMount() {
    var eventsArray = [];
    var currentCulture = '';
    var currentDefaultMessages = {};
    var currentDeleteButtonText = '';
   if ($('[name="com.dcr.datalabel.lang"]').html()=='FR'){
    //if (/^fr\b/.test(navigator.language)) {
      currentCulture = 'fr';
      currentDefaultMessages = defaultMessages_fr;
      currentDeleteButtonText = 'SUPPRIMER';
    }else{
      currentCulture = 'en';
      currentDefaultMessages = defaultMessages_en;
      currentDeleteButtonText = 'DELETE';
    }
    
    $('div[name="CalendarDataTable"] .grid-body .grid-body-content tr').not('.empty-grid').each(function(){
      var $this = $(this);
      this.event = new Object;
      var my_self = this;
      $this.children("td").each(function( idx ) {
        my_self.event.allDay=true;
        my_self.event.deleteButtonText=currentDeleteButtonText;
        switch(idx){
          //ID
          case 0:
            my_self.event.id=$(this).data("options").value;
            break;
          //COUNTRY
          case 1:
            my_self.event.country=$(this).data("options").value;
            break;
          //BU
          case 2:
            my_self.event.bu=$(this).data("options").value;
            break;
          //ENTITY
          case 3:
            my_self.event.entity=$(this).data("options").value;
            break;
          //SITE
          case 4:
            my_self.event.site=$(this).data("options").value;
            break;
          //SAFE
          case 5:
            my_self.event.safe=$(this).data("options").value;
            break;  
          //START DATE
          case 6:
            my_self.event.start=$(this).data("options").value;
            break;
          //END DATE
          case 7:
            my_self.event.end=$(this).data("options").value;
            break;
          //TASK NAME FR
          case 8:
            if (currentCulture=='fr') {
              my_self.event.title=$(this).data("options").value;
            }
            break;
          //TASK NAME EN
          case 9:
            if (currentCulture=='en') {
              my_self.event.title=$(this).data("options").value;
            }
            break;  
          //TASK TYPE INSTANCE
          case 10:
            break;
          //TASK TYPE ID
          case 11:
            break;
          // TASK COLOR
          case 12:
            my_self.event.color=$(this).data("options").value;
            break;
          default:
            console.log("Unbound value");    
        }
        my_self.event.desc= my_self.event.country ;
		if ( my_self.event.bu ) {
			my_self.event.desc+=" / " + my_self.event.bu;
			if ( my_self.event.entity ) {
				my_self.event.desc+=" / " + my_self.event.entity;
				if ( my_self.event.site ) {
					my_self.event.desc+=" / " + my_self.event.site;
				}				
			}
		}
        if(my_self.event.safe != ""){
          my_self.event.desc = my_self.event.desc + " / " + my_self.event.safe;
        }
      });
      eventsArray.push(this.event);
    });
    this.setState({defaultCulture: currentCulture, defaultMessages: currentDefaultMessages, defaultDeleteButtonText: currentDeleteButtonText, events : eventsArray});
  };

  render() {
    return (
      <div className="App">
        <Calendar
          defaultDate={moment().toDate()}
          defaultView="month"
          events={this.state.events}
          localizer={localizer}
          messages={this.state.defaultMessages}
          //onEventDrop={this.onEventDrop}
          //onEventResize={this.onEventResize}
          //resizable
          culture={this.state.defaultCulture}
          style={{ height: "90vh" }}
          //resources={resourceMap}
          //resourceIdAccessor="resourceId"
          //resourceTitleAccessor="resourceTitle"
          eventPropGetter={event => ({
            style: {
              backgroundColor: event.color,
              color: 'white',
              border: '0px'
            }
          })}
          components={{
            event: Event
          }}
        />
    </div>
    );
  };

  addCreatedEvent() {
    var lastEvent = new Object;
    var currentCulture = this.state.defaultCulture;
    var currentDeleteButtonText = this.state.defaultDeleteButtonText;
    $('div[name="CalendarDataTable"] .grid-body .grid-body-content tr').not('.empty-grid').last().children("td").each(function( idx ) {
      lastEvent.allDay=true;
      lastEvent.deleteButtonText=currentDeleteButtonText;
      switch(idx){
        //ID
        case 0:
          lastEvent.id=$(this).data("options").value;
          break;
        //COUNTRY
        case 1:
          lastEvent.country=$(this).data("options").value;
          break;
        //BU
        case 2:
          lastEvent.bu=$(this).data("options").value;
          break;
        //ENTITY
        case 3:
          lastEvent.entity=$(this).data("options").value;
          break;
        //SITE
        case 4:
          lastEvent.site=$(this).data("options").value;
          break;
        //SAFE
        case 5:
          lastEvent.safe=$(this).data("options").value;
          break;
        //START DATE
        case 6:
          lastEvent.start=$(this).data("options").value;
          break;
        //END DATE
        case 7:
          lastEvent.end=$(this).data("options").value;
          break;
        //TASK NAME FR
        case 8:
          if (currentCulture=='fr') {
            lastEvent.title=$(this).data("options").value;
          }
          break;
        //TASK NAME EN
        case 9:
          if (currentCulture=='en') {
            lastEvent.title=$(this).data("options").value;
          }
          break;  
        //TASK TYPE INSTANCE
        case 10:
          break;
        //TASK TYPE ID
        case 11:
          break;
        // TASK COLOR
        case 12:
          lastEvent.color=$(this).data("options").value;
          break;
        default:
          console.log("Unbound value");    
      }
      lastEvent.desc= lastEvent.country +" / " + lastEvent.bu + " / " + lastEvent.entity + " / " + lastEvent.site;
      if(lastEvent.safe != ""){
        lastEvent.desc = lastEvent.desc + " / " + lastEvent.safe;
      }
    });
    var newEventsArray = [...this.state.events, lastEvent];
    this.setState({events : newEventsArray});
  }
};

export default App; 