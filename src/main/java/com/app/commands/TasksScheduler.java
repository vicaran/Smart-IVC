package com.app.commands;

import com.app.repositories.AddressRepository;
import com.app.repositories.BuildingRepository;
import com.app.repositories.CityRepository;
import com.app.repositories.SuburbRepository;
import com.app.repositories.TypeRepository;
import com.app.utils.LogColors;

import org.springframework.stereotype.Service;

import java.util.Timer;
import java.util.TimerTask;

/**
 * Created by Andrea on 29/03/2017.
 */
@Service
public class TasksScheduler {


    /**
     * Instantiates a new Tasks scheduler.
     *
     * @param buildingRepository the building repository
     * @param cityRepository     the city repository
     * @param suburbRepository   the suburb repository
     * @param addressRepository  the address repository
     * @param typeRepository     the type repository
     */
    public TasksScheduler(BuildingRepository buildingRepository, CityRepository cityRepository, SuburbRepository suburbRepository, AddressRepository addressRepository, TypeRepository typeRepository) {
        Timer updateTimer = new Timer();
        ConverterCommand converterCommand = new ConverterCommand(buildingRepository, addressRepository);
        CityLoaderCommand cityLoaderCommand = new CityLoaderCommand(buildingRepository, cityRepository, addressRepository);
        CityInformationCommand cityInformationCommand = new CityInformationCommand(addressRepository, typeRepository, suburbRepository, buildingRepository);

        TimerTask myLoadLuganoTask = new TimerTask() {
            @Override
            public void run() {
                System.out.println(LogColors.ANSI_CYAN + "Initialize City of Lugano Data..." + LogColors.ANSI_RESET);
                cityLoaderCommand.loadLuganoTask();
                System.out.println(LogColors.ANSI_GREEN + "Lugano data loaded!" + LogColors.ANSI_RESET);
            }
        };
        updateTimer.schedule(myLoadLuganoTask, 5000);

        TimerTask myConverterTask = new TimerTask() {
            @Override
            public void run() {
                System.out.println(LogColors.ANSI_CYAN + "Converting Swiss to Global coordinates..." + LogColors.ANSI_RESET);
                converterCommand.converterTask();
                System.out.println(LogColors.ANSI_GREEN + "Conversion from Swiss to Global complete!" + LogColors.ANSI_RESET);
            }
        };
        updateTimer.schedule(myConverterTask, 6000);

        TimerTask myAdditionalInformationLugano = new TimerTask() {
            @Override
            public void run() {
                System.out.println(LogColors.ANSI_CYAN + "Loading Lugano data about Primary and Secondary..." + LogColors.ANSI_RESET);
                cityLoaderCommand.additionalLuganoInformationTask();
                System.out.println(LogColors.ANSI_GREEN + "Lugano data loaded!" + LogColors.ANSI_RESET);
            }
        };
        updateTimer.schedule(myAdditionalInformationLugano, 7000);

        TimerTask myInformationSuburbTaskSwissTopo = new TimerTask() {
            @Override
            public void run() {
                System.out.println(LogColors.ANSI_CYAN + "Updating Suburbs from SwissTopo..." + LogColors.ANSI_RESET);
                cityInformationCommand.informationSuburbTaskFromSwissTopo();
                System.out.println(LogColors.ANSI_GREEN + "Suburbs updated!" + LogColors.ANSI_RESET);
            }
        };
        updateTimer.schedule(myInformationSuburbTaskSwissTopo, 8000);

        TimerTask myInformationAddressTaskSwissTopo = new TimerTask() {
            @Override
            public void run() {
                System.out.println(LogColors.ANSI_CYAN + "Updating Addresses from SwissTopo..." + LogColors.ANSI_RESET);
                cityInformationCommand.informationAddressTaskFromSwissTopo();
                System.out.println(LogColors.ANSI_GREEN + "Addresses updated!" + LogColors.ANSI_RESET);
            }
        };
        updateTimer.schedule(myInformationAddressTaskSwissTopo, 9000);


        TimerTask myInformationTaskOsm = new TimerTask() {
            @Override
            public void run() {
                System.out.println(LogColors.ANSI_CYAN + "Updating Addresses and Types from OSM..." + LogColors.ANSI_RESET);
                cityInformationCommand.informationTaskFromOsm();
                System.out.println(LogColors.ANSI_GREEN + "Addresses and Types updated!" + LogColors.ANSI_RESET);
            }
        };
        updateTimer.schedule(myInformationTaskOsm, 10000);

        TimerTask myEndLogTask = new TimerTask() {
            @Override
            public void run() {
                System.out.println(LogColors.ANSI_PURPLE + "The Update of the data has been completed!" + LogColors.ANSI_RESET);
            }
        };
        updateTimer.schedule(myEndLogTask, 11000);


    }
}
