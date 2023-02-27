/*
 * Provus Services Quoting
 * Copyright (c) 2023 Provus Inc. All rights reserved.
 */

import { LightningElement, wire, api } from "lwc";
import GET_QUOTES from "@salesforce/apex/GetQuotes.getQuotesRecords";
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from 'lightning/uiRecordApi';

const columns = [
  { label: "Name", fieldName: "Name", editable: false },
  { label: "Start Date", fieldName: "Start_Date__c", type: "date", editable: true },
  { label: "End Date", fieldName: "EndDate__c", type: "date", editable: true }
];


export default class EditQuote extends LightningElement {
  @api recordId;
  columns = columns;
  draftValues;
  records;
  error;
  quoteData = {
    name: "Quote Name",
    endDate: 1547250828000
  };

  @wire(GET_QUOTES)
  wiredData;

  handleEdit(event) {
    // Convert datatable draft values into record objects
    const records = event.detail.draftValues.slice().map((draftValue) => {
      const fields = Object.assign({}, draftValue);
      return { fields };
    });

    // Clear all datatable draft values
    this.draftValues = [];

    try {
      // Update all records in parallel thanks to the UI API
      const recordUpdatePromises = records.map((record) =>
        updateRecord(record)
      );
      Promise.all(recordUpdatePromises);

      // Report success with a toast
      this.dispatchEvent(
        new ShowToastEvent({
          title: 'Success',
          message: 'Quote updated',
          variant: 'success'
        })
      );
      refreshApex(this.wiredData);
    } catch (error) {
      this.dispatchEvent(
        new ShowToastEvent({
          title: 'Error updating or reloading contacts',
          message: error.body.message,
          variant: 'error'
        })
      );
    }
  }
}
