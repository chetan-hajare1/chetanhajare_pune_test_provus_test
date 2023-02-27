public class GetQuotes {
    
     @AuraEnabled(cacheable=true)
    public static List<Quote__c> getQuotesRecords(){
        return [SELECT Id, Name, Start_Date__c, EndDate__c
               	FROM Quote__c];
    }
}