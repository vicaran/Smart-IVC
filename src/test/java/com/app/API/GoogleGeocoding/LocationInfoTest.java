package com.app.API.GoogleGeocoding;

import com.google.maps.GeocodingApi;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

/**
 * Created by Andrea on 16/03/2017.
 */
@RunWith(PowerMockRunner.class)
@PrepareForTest(GeocodingApi.class)
public class LocationInfoTest {


    @Test
    public void testCityInfo() throws Exception {
        //given


//        String content = new Scanner(new File("src/test/java/com/app/instancesAPI/city.json")).useDelimiter("\\Z").next();
//        JSONObject obj = new JSONObject(content);
//
//        System.out.println(obj.toString());
//
//        PowerMockito.mockStatic(GeocodingApi.class);
//        BDDMockito.given(GeocodingApi.newRequest(Mockito.any())).willReturn();
    }
}

